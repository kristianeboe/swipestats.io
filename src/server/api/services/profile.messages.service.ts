import { type TinderJsonMatch } from "@/lib/interfaces/TinderDataJSON";
import {
  type Message,
  type Match,
  type MessageType,
  type Prisma,
} from "@prisma/client";
import { differenceInDays, formatDistance } from "date-fns";
import { nanoid } from "nanoid";
import { omit } from "radash";
import he from "he";

// import { getFrancLanguageContext } from "./language.service";

export function createMessagesAndMatches(
  tjms: TinderJsonMatch[],
  tinderProfileId: string,
) {
  const sortedMatches = tjms.reverse(); // to get them in chronological order

  const matchesInput: Prisma.MatchCreateManyInput[] = sortedMatches.map(
    (tjm, i) => {
      const totalMessageCount = tjm.messages.length;

      const firstMessage = tjm.messages[0];
      const firstMessageSentAt = firstMessage?.sent_date
        ? new Date(firstMessage.sent_date)
        : undefined;

      const lastMessage = tjm.messages.at(-1);
      const lastMessageSentAt = lastMessage?.sent_date
        ? new Date(lastMessage.sent_date)
        : undefined;

      const messageCounts = tjm.messages.reduce(
        (acc, cur) => {
          const type = getMessageType(cur);
          acc[type] = (acc[type] || 0) + 1;
          return acc;
        },
        {
          TEXT: 0,
          GIF: 0,
          GESTURE: 0,
          CONTACT_CARD: 0,
          ACTIVITY: 0,
          OTHER: 0,
        }, // as Record<MessageType, number>,
      );

      // const messagesConjoined = tjm.messages
      //   .map((msg) => he.decode(msg.message))
      //   .join("\n");

      // const { mostProbableLanguage, topTrigrams } =
      //   getFrancLanguageContext(messagesConjoined);

      return {
        id: nanoid(),
        tinderMatchId: tjm.match_id,
        tinderProfileId,

        totalMessageCount: totalMessageCount,

        // languageFranc: mostProbableLanguage,
        // languageTrigramsFranc: topTrigrams,

        order: i,

        initialMessageAt: firstMessageSentAt,
        lastMessageAt: lastMessageSentAt,

        textCount: messageCounts.TEXT,
        gifCount: messageCounts.GIF,
        gestureCount: messageCounts.GESTURE,
        otherMessageTypeCount: Object.values(
          omit(messageCounts, ["TEXT", "GIF", "GESTURE"]),
        ).reduce((acc, cur) => acc + cur, 0),
      };
    },
  );

  const messagesInput: Prisma.MessageCreateManyInput[] = sortedMatches.flatMap(
    (tjm, i) => {
      const match = matchesInput[i]!;
      return tjm.messages
        .filter((msg) => !!msg.sent_date) // Either this or // .filter((msg) => msg.message !== "platzhaltertext"
        .map((msg, i) => {
          const lastMessage = tjm.messages[i - 1];

          const timestampOfCurrentMessage = new Date(msg.sent_date).getTime();
          const timestampOfLastMessage = lastMessage
            ? new Date(lastMessage.sent_date).getTime()
            : undefined;
          const timeSinceLastMessage = timestampOfLastMessage
            ? timestampOfCurrentMessage - timestampOfLastMessage
            : 0;

          const messageType = getMessageType(msg);

          const content = msg.message ? he.decode(msg.message) : "";

          // const { mostProbableLanguage, topTrigrams } =
          //   getFrancLanguageContext(content);

          return {
            messageType,
            to: msg.to,
            sentDate: new Date(msg.sent_date),
            sentDateRaw: msg.sent_date,
            content,
            charCount: content?.length ?? 0,
            contentRaw: msg.message ?? "",
            type: msg.type ? String(msg.type) : undefined,
            // primaryLanguage: mostProbableLanguage,
            // languagesSpoken: topTrigrams,
            gifUrl: msg.fixed_height,
            matchId: match.id!,
            tinderProfileId,
            order: i,

            timeSinceLastMessage: timeSinceLastMessage,
            timeSinceLastMessageRelative: timestampOfLastMessage
              ? formatDistance(
                  timestampOfLastMessage,
                  timestampOfCurrentMessage,
                )
              : null,
            // language: "", // TODO
            //emotionScore: 0
          };
        });
    },
  );

  return {
    matchesInput,
    messagesInput,
  };
}

function getMessageType(msg: TinderJsonMatch["messages"][number]): MessageType {
  if (!msg.type) return "TEXT";
  switch (msg.type) {
    case "gif":
      return "GIF";
    case "gesture":
      return "GESTURE";
    case "contact_card":
      return "CONTACT_CARD";
    case "activity":
      return "ACTIVITY";
    case "1":
      return "TEXT"; // actually a number / Int, but actually actually it's just a normal text
    // @ts-expect-error just covering my bases
    case 1:
      return "TEXT"; // actually a number / Int, but actually actually it's just a normal text
    case "vibes":
      return "OTHER";

    // case "swipe_note": return "SWIPE_NOTE" // other for now

    default:
      return "OTHER";
  }
}

export function getMessagesMeta(messagesRaw: TinderJsonMatch[]) {
  const meta = {
    numberOfConversations: messagesRaw.length,
    numberOfConversationsWithMessages: 0,
    messagesTotal: 0,
    maxConversationMessageCount: 0, // in messages
    longestConversationInDays: 0, //days
    messageCountInLongestConversationInDays: 0,
    longestConversationInDaysTwoWeekMax: 0, //days
    messageCountInConversationTwoWeekMax: 0,
    averageConversationLength: 0,
    averageConversationLengthInDays: 0, //days
    medianConversationLength: 0,
    medianConversationLengthInDays: 0, // days
    numberOfOneMessageConversations: 0, // times where you have sent 1 message, but never followed up. Don't know if you got a reply or not.
    percentageOfOneMessageConversations: 0,
    nrOfGhostingsAfterInitialMatch: 0, // you matched, and you either sent no messages, or you never replied to theirs
    //nrOfGhostings
  };

  if (messagesRaw.length === 0) return meta; // no matches, nothing to count // todo this should probably reflect in profileMeta not being created in order to not affect global averages. ? Hover that could also be combatted with SQL queries choosing profiles that have activity.

  const conversationLengths: { days: number; messages: number }[] = [];

  messagesRaw.forEach((conversation) => {
    const messagesSent = conversation.messages.length;
    meta.messagesTotal += messagesSent; // just add to the total

    meta.averageConversationLength += messagesSent;

    if (messagesSent === 0) {
      meta.nrOfGhostingsAfterInitialMatch += 1;
      conversationLengths.push({
        days: 0,
        messages: 0,
      });
    } else {
      if (messagesSent === 1) {
        meta.numberOfOneMessageConversations += 1;
      }

      // "Tue, 30 Nov 2021 06:09:58 GMT" // new Date() parsing confirmed
      const conversationStartDate = new Date(
        conversation.messages[0]!.sent_date,
      );
      const conversationEndDate = new Date(
        conversation.messages[messagesSent - 1]!.sent_date,
      );
      const conversationLengthInDays = differenceInDays(
        conversationEndDate, // for some reason end date comes first, otherwise you end up wiht - amount of days
        conversationStartDate,
      );
      // console.log("conversationLength", {
      //   conversationStartDate,
      //   conversationEndDate,
      //   conversationLengthInDays,
      // });

      const maxGap = conversation.messages
        .slice(1)
        .reduce((max, message, index) => {
          const previousDate = new Date(
            conversation.messages[index]!.sent_date,
          ); // previous message will always be known
          const currentDate = new Date(message.sent_date);
          return Math.max(max, differenceInDays(currentDate, previousDate));
        }, 0);

      if (
        maxGap < 14 &&
        conversationLengthInDays > meta.longestConversationInDaysTwoWeekMax
      ) {
        meta.longestConversationInDaysTwoWeekMax = conversationLengthInDays;
        meta.messageCountInConversationTwoWeekMax = messagesSent;
      }

      conversationLengths.push({
        days: conversationLengthInDays,
        messages: messagesSent,
      });

      if (messagesSent > meta.maxConversationMessageCount) {
        meta.maxConversationMessageCount = messagesSent;
      }

      if (conversationLengthInDays > meta.longestConversationInDays) {
        meta.longestConversationInDays = conversationLengthInDays;
        meta.messageCountInLongestConversationInDays = messagesSent;
      }

      meta.averageConversationLengthInDays += conversationLengthInDays;
    }
  });

  // Calculate medians and averages only if there are valid conversation lengths
  if (conversationLengths.length) {
    const sortedByDays = conversationLengths.sort((a, b) => a.days - b.days);
    const sortedByMessages = conversationLengths.sort(
      (a, b) => a.messages - b.messages,
    );
    const midIndex = Math.floor(conversationLengths.length / 2);

    meta.medianConversationLengthInDays = sortedByDays[midIndex]!.days;
    meta.medianConversationLength = sortedByMessages[midIndex]!.messages;

    meta.averageConversationLength =
      meta.averageConversationLength / meta.numberOfConversations;

    meta.averageConversationLengthInDays =
      meta.averageConversationLengthInDays / meta.numberOfConversations;

    meta.percentageOfOneMessageConversations = Math.round(
      (meta.numberOfOneMessageConversations / meta.numberOfConversations) * 100,
    );
  }
  meta.numberOfConversationsWithMessages =
    meta.numberOfConversations - meta.nrOfGhostingsAfterInitialMatch;

  return meta;
}

export function getMessagesMetaFromMatches(
  matches: (Match & {
    messages: Message[];
  })[],
) {
  const meta = {
    numberOfConversations: matches.length,
    numberOfConversationsWithMessages: 0,
    messagesTotal: 0,
    maxConversationMessageCount: 0, // in messages
    longestConversationInDays: 0, //days
    messageCountInLongestConversationInDays: 0,
    longestConversationInDaysTwoWeekMax: 0, //days
    messageCountInConversationTwoWeekMax: 0,
    averageConversationMessageCount: 0,
    averageConversationLengthInDays: 0, //days
    medianConversationMessageCount: 0,
    medianConversationLengthInDays: 0, // days
    numberOfOneMessageConversations: 0, // times where you have sent 1 message, but never followed up. Don't know if you got a reply or not.
    percentageOfOneMessageConversations: 0,
    nrOfGhostingsAfterInitialMatch: 0, // you matched, and you either sent no messages, or you never replied to theirs
    //nrOfGhostings
  };

  if (matches.length === 0) return meta; // no matches, nothing to count // todo this should probably reflect in profileMeta not being created in order to not affect global averages. ? Hover that could also be combatted with SQL queries choosing profiles that have activity.

  const conversationLengths: { days: number; messages: number }[] = [];

  matches.forEach((conversation) => {
    const messagesSent = conversation.messages.length;
    meta.messagesTotal += messagesSent; // just add to the total

    meta.averageConversationMessageCount += messagesSent;

    if (messagesSent === 0) {
      meta.nrOfGhostingsAfterInitialMatch += 1;
      conversationLengths.push({
        days: 0,
        messages: 0,
      });
    } else {
      if (messagesSent === 1) {
        meta.numberOfOneMessageConversations += 1;
      }

      // "Tue, 30 Nov 2021 06:09:58 GMT" // new Date() parsing confirmed
      const conversationStartDate = new Date(
        conversation.messages[0]!.sentDate,
      );
      const conversationEndDate = new Date(
        conversation.messages[messagesSent - 1]!.sentDate,
      );
      const conversationLengthInDays = differenceInDays(
        conversationEndDate, // for some reason end date comes first, otherwise you end up wiht - amount of days
        conversationStartDate,
      );
      // console.log("conversationLength", {
      //   conversationStartDate,
      //   conversationEndDate,
      //   conversationLengthInDays,
      // });

      const maxGap = conversation.messages
        .slice(1)
        .reduce((max, message, index) => {
          const previousDate = new Date(conversation.messages[index]!.sentDate); // previous message will always be known
          const currentDate = new Date(message.sentDate);
          return Math.max(max, differenceInDays(currentDate, previousDate));
        }, 0);

      if (
        maxGap < 14 &&
        conversationLengthInDays > meta.longestConversationInDaysTwoWeekMax
      ) {
        meta.longestConversationInDaysTwoWeekMax = conversationLengthInDays;
        meta.messageCountInConversationTwoWeekMax = messagesSent;
      }

      conversationLengths.push({
        days: conversationLengthInDays,
        messages: messagesSent,
      });

      if (messagesSent > meta.maxConversationMessageCount) {
        meta.maxConversationMessageCount = messagesSent;
      }

      if (conversationLengthInDays > meta.longestConversationInDays) {
        meta.longestConversationInDays = conversationLengthInDays;
        meta.messageCountInLongestConversationInDays = messagesSent;
      }

      meta.averageConversationLengthInDays += conversationLengthInDays;
    }
  });

  // Calculate medians and averages only if there are valid conversation lengths
  if (conversationLengths.length) {
    const sortedByDays = conversationLengths.sort((a, b) => a.days - b.days);
    const sortedByMessages = conversationLengths.sort(
      (a, b) => a.messages - b.messages,
    );
    const midIndex = Math.floor(conversationLengths.length / 2);

    meta.medianConversationLengthInDays = sortedByDays[midIndex]!.days;
    meta.medianConversationMessageCount = sortedByMessages[midIndex]!.messages;

    meta.averageConversationMessageCount =
      meta.averageConversationMessageCount / meta.numberOfConversations;

    meta.averageConversationLengthInDays =
      meta.averageConversationLengthInDays / meta.numberOfConversations;

    meta.percentageOfOneMessageConversations = Math.round(
      (meta.numberOfOneMessageConversations / meta.numberOfConversations) * 100,
    );
  }
  meta.numberOfConversationsWithMessages =
    meta.numberOfConversations - meta.nrOfGhostingsAfterInitialMatch;

  return meta;
}
