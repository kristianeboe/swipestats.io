# SwipeStats Blog Posts Migration Tracker

> Working document for migrating blog posts from Prismic to Velite/MDX

**Last updated:** October 13, 2025  
**Migration Progress:** 72/75 posts completed (96%)

---

## Workflow

1. **Get URL** - User provides the live blog post URL from swipestats.io/blog
2. **Verify Content** - Read the content from the live site
3. **Create/Update MDX** - Save as `.mdx` file in `content/posts/` with proper frontmatter
4. **Update Tracker** - Mark as ✅ and add slug/filename info
5. **Verify** - Check that dates match and post displays correctly

## prompt:

I'm migrating SwipeStats blog posts from Prismic to Velite/MDX. Working through 75 posts one at a time.

**Current Status:** (see @BLOG_POSTS_TRACKER.md )

**Your Task:**
I'll provide URLs from https://www.swipestats.io/blog. For each:

1. Read the live content (use web search - content appears in results)
2. Create MDX file in `/content/posts/[slug].mdx` with:
   - Frontmatter matching live site (check `velite.config.ts` for schema) @velite.config.ts
   - Date must match EXACTLY (format: YYYY-MM-DD)
   - Copy all content sections, headings, lists, and CTA components, you can see available components in @MDXContent.tsx . Alert me if you want to create new ones.

3. Update `BLOG_POSTS_TRACKER.md`:
   - Change status 🔍 → ✅
   - Update completion count
   - Add to "Completed Posts" list
   - Update "Last verified" note

**Key Points:**

- Preserve all `<CtaNewsletter>`, `<CtaCarousel>`, `<CtaShowcase>` components
- Keep markdown formatting (##, numbered lists, etc.)
- Use URL slug for filename
- Default author is "Paw" (check tracker for exceptions)
- If you see bold text like "Swipestats" or "Profile Review" you should add them as links to Swipestats.io and /products/dating-profile-review (the blog is hosted on Swipestats.io) (but be sure to add them with full https//www.swipestats.io otherwise velite crashes, [**Swipestats**](https://www.swipestats.io))

Ready to start! Next URL:

---

## Blog Posts (Sorted by Date - Newest First)

| Date              | Title                                                                                                       | Author      | Status | URL                                                                                                  |
| ----------------- | ----------------------------------------------------------------------------------------------------------- | ----------- | ------ | ---------------------------------------------------------------------------------------------------- |
| Tue, 23 Sept 2025 | How to Answer the 'My last journal entry was about' Hinge Prompt                                            | Paw         | ✅     | https://www.swipestats.io/blog/my-last-journal-entry-was-about-hinge-prompt-answers                  |
| Thu, 1 May 2025   | Is Tinder Gold Worth It in 2025? The Brutal Truth                                                           | Paw         | ✅     | https://www.swipestats.io/blog/is-tinder-gold-worth-it                                               |
| Tue, 22 Apr 2025  | How to Answer the 'My Love Language is' Hinge Prompt to Skyrocket Your Matches                              | Paw         | ✅     | https://www.swipestats.io/blog/my-love-language-is-hinge-prompt-answers                              |
| Sun, 13 Apr 2025  | How to Answer the 'My most irrational fear' Hinge Prompt                                                    | Paw         | ✅     | https://www.swipestats.io/blog/my-most-irrational-fear-hinge-prompt-answers                          |
| Wed, 9 Apr 2025   | How to Answer the 'My self-care routine is' Hinge Prompt                                                    | Paw         | ✅     | https://www.swipestats.io/blog/my-self-care-routine-is-hinge-prompt-answers                          |
| Fri, 21 Mar 2025  | The Truth Behind Dating Apps: What Our Dating App Statistics of 3,700+ Users Reveals                        | Paw         | ✅     | https://www.swipestats.io/blog/tinder-statistics                                                     |
| Mon, 17 Mar 2025  | How to Answer the 'My best celebrity impression' Hinge Prompt                                               | Paw         | ✅     | https://www.swipestats.io/blog/my-best-celebrity-impression-hinge-prompt-answers                     |
| Thu, 13 Mar 2025  | How to Answer the 'My best dad joke' Hinge Prompt: From Groan-Worthy to Match-Worthy                        | Paw         | ✅     | https://www.swipestats.io/blog/my-best-dad-joke-hinge-prompt-answers                                 |
| Mon, 10 Mar 2025  | How to Answer the 'My most controversial opinion is' Hinge Prompt (Make Your Matches Do a Double Take)      | Paw         | ✅     | https://www.swipestats.io/blog/my-most-controversial-opinion-is-hinge-prompt-answers                 |
| Sat, 25 Jan 2025  | Dating Profile Photos That Get Girls to Notice You                                                          | Joe Buchoff | ✅     | https://www.swipestats.io/blog/dating-profile-photos-that-get-girls-to-notice-you                    |
| Thu, 6 Mar 2025   | Elite Singles Review 2025: Is This High-End Dating App Worth Your Time and Money?                           | Paw         | ✅     | https://www.swipestats.io/blog/elite-singles-review                                                  |
| Sun, 2 Mar 2025   | How to Answer the 'My BFF's reasons for why you should date me' Hinge Prompt                                | Paw         | ✅     | https://www.swipestats.io/blog/my-bffs-reasons-for-why-you-should-date-me-hinge-prompt-answers       |
| Sun, 2 Mar 2025   | How to Answer the 'Most spontaneous thing I've done' Hinge Prompt                                           | Paw         | ✅     | https://www.swipestats.io/blog/most-spontaneous-thing-ive-done-hinge-prompt-answers                  |
| Sat, 1 Mar 2025   | How to Answer the 'Let's make sure we're on the same page about' Hinge Prompt                               | Paw         | ✅     | https://www.swipestats.io/blog/lets-make-sure-were-on-the-same-page-about-hinge-prompt-answers       |
| Wed, 26 Feb 2025  | How to Answer the 'I'll give you the set-up; you guess the punchline' Hinge Prompt                          | Paw         | ✅     | https://www.swipestats.io/blog/ill-give-you-the-set-up-you-guess-the-punchline-hinge-prompt-answers  |
| Wed, 26 Feb 2025  | How to Answer the 'My cry-in-the-car song is' Hinge Prompt and Make Matches Swoon                           | Paw         | ✅     | https://www.swipestats.io/blog/my-cry-in-the-car-song-is-hinge-prompt-answers                        |
| Mon, 24 Feb 2025  | How to Answer the 'My friends ask me for advice about' Hinge Prompt                                         | Paw         | ✅     | https://www.swipestats.io/blog/my-friends-ask-me-for-advice-about-hinge-prompt-answers               |
| Mon, 24 Feb 2025  | How to Answer the 'My biggest date fail' Hinge Prompt                                                       | Paw         | ✅     | https://www.swipestats.io/blog/my-biggest-date-fail-hinge-prompt-answers                             |
| Wed, 19 Feb 2025  | How to Answer the 'Let's chat about' Hinge Prompt                                                           | Paw         | ✅     | https://www.swipestats.io/blog/lets-chat-about-hinge-prompt-answers                                  |
| Wed, 19 Feb 2025  | How to Answer the 'I'll pick the topic if you start the conversation' Hinge Prompt                          | Paw         | ✅     | https://www.swipestats.io/blog/ill-pick-the-topic-if-you-start-the-conversation-hinge-prompt-answers |
| Tue, 18 Feb 2025  | How to Answer the 'My favourite line from a film' Hinge Prompt: From Classics to Snark                      | Paw         | ✅     | https://www.swipestats.io/blog/my-favourite-line-from-a-film-hinge-prompt-answers                    |
| Tue, 18 Feb 2025  | How to Answer the 'My greatest strength' Hinge Prompt to Boost Your Matches                                 | Paw         | ✅     | https://www.swipestats.io/blog/my-greatest-strength-hinge-prompt-answers                             |
| Tue, 11 Feb 2025  | How to Answer the 'If loving this is wrong, I don't want to be right' Hinge Prompt                          | Paw         | ✅     | https://www.swipestats.io/blog/if-loving-this-is-wrong-i-dont-want-to-be-right-hinge-prompt-answers  |
| Wed, 12 Feb 2025  | How to Answer the 'I'm looking for' Hinge Prompt                                                            | Paw         | ✅     | https://www.swipestats.io/blog/im-looking-for-hinge-prompt-answers                                   |
| Mon, 10 Feb 2025  | How to Answer the 'I'm weirdly attracted to' Hinge Prompt                                                   | Paw         | ✅     | https://www.swipestats.io/blog/im-weirdly-attracted-to-hinge-prompt-answers                          |
| Mon, 10 Feb 2025  | How to Answer the 'Let's debate this topic' Hinge Prompt                                                    | Paw         | ✅     | https://www.swipestats.io/blog/lets-debate-this-topic-hinge-prompt-answers                           |
| Fri, 7 Feb 2025   | How to Answer the 'I'm convinced that' Hinge Prompt to Stand Out and Get Matches                            | Paw         | ✅     | https://www.swipestats.io/blog/im-convinced-that-hinge-prompt-answers                                |
| Thu, 6 Feb 2025   | How to Answer the 'I'll brag about you to my friends if' Hinge Prompt                                       | Paw         | ✅     | https://www.swipestats.io/blog/ill-brag-about-you-to-my-friends-if-hinge-prompt-answers              |
| Wed, 5 Feb 2025   | How to Answer the 'I won't shut up about' Hinge Prompt                                                      | Paw         | ✅     | https://www.swipestats.io/blog/i-wont-shut-up-about-hinge-prompt-answers                             |
| Wed, 5 Feb 2025   | How to Answer the 'I'd fall for you if' Hinge Prompt to Make Your Matches Swoon                             | Paw         | ✅     | https://www.swipestats.io/blog/id-fall-for-you-if-hinge-prompt-answers                               |
| Sun, 2 Feb 2025   | The League Review 2025: Elite Dating or Elitist Nightmare?                                                  | Paw         | ✅     | https://www.swipestats.io/blog/the-league-review                                                     |
| Thu, 30 Jan 2025  | Raya Review 2025: Swiping With The Stars                                                                    | Paw         | ✅     | https://www.swipestats.io/blog/raya-review                                                           |
| Wed, 29 Jan 2025  | How to Answer the 'I feel most supported when' Hinge Prompt and Get Matches                                 | Paw         | ✅     | https://www.swipestats.io/blog/i-feel-most-supported-when-hinge-prompt-answers                       |
| Tue, 28 Jan 2025  | How to Answer the 'I know the best spot in town for' Hinge Prompt (2025)                                    | Paw         | ✅     | https://www.swipestats.io/blog/i-know-the-best-spot-in-town-for-hinge-prompt-answers                 |
| Tue, 28 Jan 2025  | How to Answer the 'I hype myself up by' Hinge Prompt (That Actually Work)                                   | Paw         | ✅     | https://www.swipestats.io/blog/i-hype-myself-up-by-hinge-prompt-answers                              |
| Sat, 25 Jan 2025  | How to Answer the 'I geek out on' Hinge Prompt and Make Your Matches Short-Circuit                          | Paw         | ✅     | https://www.swipestats.io/blog/i-geek-out-on-hinge-prompt-answers                                    |
| Fri, 24 Jan 2025  | How to Answer the 'I recently discovered that' Hinge Prompt to Skyrocket Your Matches                       | Paw         | ✅     | https://www.swipestats.io/blog/i-recently-discovered-that-hinge-prompt-answers                       |
| Thu, 23 Jan 2025  | How to Answer the 'I unwind by' Hinge Prompt and Make Matches Swipe Right                                   | Paw         | ✅     | https://www.swipestats.io/blog/i-unwind-by-hinge-prompt-answers                                      |
| Thu, 23 Jan 2025  | How to Answer the 'I wish more people knew' Hinge Prompt                                                    | Paw         | ✅     | https://www.swipestats.io/blog/i-wish-more-people-knew-hinge-prompt-answers                          |
| Fri, 17 Jan 2025  | How to Answer the 'I beat my blues by' Hinge Prompt                                                         | Paw         | ✅     | https://www.swipestats.io/blog/i-beat-my-blues-by-hinge-prompt-answers                               |
| Wed, 15 Jan 2025  | How to Answer the 'How to pronounce my name' Hinge Prompt                                                   | Paw         | ✅     | https://www.swipestats.io/blog/how-to-pronounce-my-name-hinge-prompt-answers                         |
| Wed, 15 Jan 2025  | How to Answer the 'I want someone who' Hinge Prompt: Ideas That Don't Suck                                  | Paw         | ✅     | https://www.swipestats.io/blog/i-want-someone-who-hinge-prompt-answers                               |
| Mon, 13 Jan 2025  | How to Answer the 'Guess the song' Hinge Prompt: From Classics to Clever Quips                              | Paw         | ✅     | https://www.swipestats.io/blog/guess-the-song-hinge-prompt-answers                                   |
| Sun, 12 Jan 2025  | How to Answer the 'Give me travel tips for' Hinge Prompt That'll Make You a Match Magnet                    | Paw         | ✅     | https://www.swipestats.io/blog/give-me-travel-tips-for-hinge-prompt-answers                          |
| Fri, 10 Jan 2025  | How to Answer the 'Getting personal' Hinge Prompt (That Actually Work)                                      | Paw         | ✅     | https://www.swipestats.io/blog/getting-personal-hinge-prompt-answers                                 |
| Wed, 8 Jan 2025   | How to Answer the 'First round is on me if' Hinge Prompt That Actually Work                                 | Paw         | ✅     | https://www.swipestats.io/blog/first-round-is-on-me-if-hinge-prompt-answers                          |
| Mon, 6 Jan 2025   | How to Answer the 'Don't hate me if I' Hinge Prompt That'll Make Them Swipe Right                           | Paw         | ✅     | https://www.swipestats.io/blog/dont-hate-me-if-i-hinge-prompt-answers                                |
| Sat, 4 Jan 2025   | How to Answer the 'Do you agree or disagree that' Hinge Prompt to Spark Debate and Dates                    | Paw         | ✅     | https://www.swipestats.io/blog/do-you-agree-or-disagree-that-hinge-prompt-answers                    |
| Sat, 4 Jan 2025   | Coffee Meets Bagel Review 2025: The Slow-Roasted Approach to Online Dating                                  | Paw         | ✅     | https://www.swipestats.io/blog/coffee-meets-bagel-review                                             |
| Sat, 4 Jan 2025   | Badoo Review 2025: Exploring the Chaos and Charm of a Dating Giant                                          | Paw         | ✅     | https://www.swipestats.io/blog/badoo-review                                                          |
| Sat, 4 Jan 2025   | Doublelist Review: The Unfiltered Truth About this Wild West of a Dating App                                | Paw         | ✅     | https://www.swipestats.io/blog/doublelist-review                                                     |
| Sat, 4 Jan 2025   | Hinge Review 2025: Because You're Tired of Dating Apps That Suck                                            | Paw         | ✅     | https://www.swipestats.io/blog/hinge-review                                                          |
| Sat, 4 Jan 2025   | Tinder Insights Review 2025: Why Data Matters in Modern Dating                                              | Paw         | ✅     | https://www.swipestats.io/blog/tinder-insights-review                                                |
| Sat, 4 Jan 2025   | 69 Best Rizz Pickup Lines to Get Their Attention                                                            | Paw         | ✅     | https://www.swipestats.io/blog/best-rizz-pickup-lines                                                |
| Fri, 3 Jan 2025   | How to Answer the 'Apparently, my life's soundtrack is' Hinge Prompt                                        | Paw         | ✅     | https://www.swipestats.io/blog/apparently-my-lifes-soundtrack-is-hinge-prompt-answers                |
| Thu, 2 Jan 2025   | How to Answer the 'Best travel story' Hinge Prompt: 112 Ideas That Don't Suck                               | Paw         | ✅     | https://www.swipestats.io/blog/best-travel-story-hinge-prompt-answers                                |
| Mon, 30 Dec 2024  | How to Answer the 'Biggest risk I've taken' Hinge Prompt                                                    | Paw         | ✅     | https://www.swipestats.io/blog/biggest-risk-ive-taken-hinge-prompt-answers                           |
| Sun, 29 Dec 2024  | How to Answer the 'Change my mind about' Hinge Prompt                                                       | Paw         | ✅     | https://www.swipestats.io/blog/change-my-mind-about-hinge-prompt-answers                             |
| Sat, 28 Dec 2024  | How to Answer the 'All I ask is that you' Hinge Prompt to Dominate the Game                                 | Paw         | ✅     | https://www.swipestats.io/blog/all-i-ask-is-that-you-hinge-prompt-answers                            |
| Sat, 28 Dec 2024  | How to Answer the 'A thought I recently had in the shower' Hinge Prompt to Flood Your Match Queue           | Paw         | ✅     | https://www.swipestats.io/blog/a-thought-i-recently-had-in-the-shower-hinge-prompt                   |
| Mon, 23 Dec 2024  | How to Answer the 'A quick rant about' Hinge Prompt to Rant Your Way into Someone's Heart                   | Paw         | ✅     | https://www.swipestats.io/blog/a-quick-rant-about-hinge-prompt-answers                               |
| Mon, 23 Dec 2024  | How to Answer the 'A boundary of mine is' Hinge Prompt to Spice Up Your Profile                             | Paw         | ✅     | https://www.swipestats.io/blog/a-boundary-of-mine-is-hinge-prompt-answers                            |
| Sun, 22 Dec 2024  | How to Answer the 'A random fact I love is' Hinge Prompt Without Sounding Like a Wikipedia Reject           | Paw         | ✅     | https://www.swipestats.io/blog/a-random-fact-i-love-is-hinge-prompt-answers                          |
| Sun, 22 Dec 2024  | How to Answer the 'A life goal of mine' Hinge Prompt to Supercharge Your Profile (and Maybe Your Existence) | Paw         | ✅     | https://www.swipestats.io/blog/a-life-goal-of-mine-hinge-prompt-answers                              |
| Sat, 14 Dec 2024  | 123 Ways to Answer the 'We'll Get Along If' Hinge Prompt                                                    | Paw         | ✅     | https://www.swipestats.io/blog/well-get-along-if-hinge-prompt-answers                                |
| Fri, 13 Dec 2024  | How to Answer 'Dating me is like' Hinge Prompt                                                              | Paw         | ✅     | https://www.swipestats.io/blog/dating-me-is-like-hinge-prompt-answers                                |
| Fri, 13 Dec 2024  | How to Answer 'My Therapist Would Say I' Hinge Prompt                                                       | Paw         | ✅     | https://www.swipestats.io/blog/my-therapist-would-say-i-hinge-prompt-answers                         |
| Sat, 7 Dec 2024   | How to Answer the 'Together We Could' Hinge Prompt Without Sounding Like a Complete Tool                    | Paw         | ✅     | https://www.swipestats.io/blog/together-we-could-hinge-prompt                                        |
| Tue, 29 Oct 2024  | How to Answer the 'I Go Crazy For' Hinge Prompt Without Sounding Like a Desperate Lunatic                   | Paw         | ✅     | https://www.swipestats.io/blog/i-go-crazy-for-hinge-prompt                                           |
| Tue, 29 Oct 2024  | How to Get More Matches on Tinder as a Man                                                                  | Paw         | ✅     | https://www.swipestats.io/blog/how-to-get-more-matches-on-tinder-as-a-man                            |
| Tue, 29 Oct 2024  | How to Answer the 'Green Flags I Look Out For' Hinge Prompt Without Sounding Like a Complete Tool           | Paw         | ✅     | https://www.swipestats.io/blog/green-flags-i-look-out-for-hinge-prompt                               |
| Tue, 29 Oct 2024  | When do Tinder Likes Reset?                                                                                 | Paw         | ✅     | https://www.swipestats.io/blog/when-do-tinder-likes-reset                                            |
| Mon, 26 Aug 2024  | How to compliment a girl's picture                                                                          | Paw         | ✅     | https://www.swipestats.io/blog/how-to-compliment-a-girls-picture                                     |

---

## Statistics

- **Total Posts:** 75
- **Completed:** 72 ✅ (96%)

- **Need Content:** 3 🔍 (4%)

## Current Session Notes

- Last verified: Give me travel tips for (2025-01-12) - Content matches live site, migrated from Prismic
- Blog layout standardized: All posts use sticky CTA layout with centered hero
- Sticky CTA breakpoint: `xl` (1280px+)
- Default `showStickyVisual: true` in velite config
- URLs extracted and added to tracker (2025-10-02)

## Completed Posts (MDX Files)

1. ✅ my-last-journal-entry-was-about-hinge-prompt-answers.mdx
2. ✅ is-tinder-gold-worth-it.mdx
3. ✅ my-love-language-is-hinge-prompt-answers.mdx
4. ✅ my-most-irrational-fear-hinge-prompt-answers.mdx
5. ✅ my-self-care-routine-is-hinge-prompt-answers.mdx
6. ✅ elite-singles-review-2025.mdx
7. ✅ ill-give-you-the-set-up-you-guess-the-punchline-hinge-prompt-answers.mdx
8. ✅ my-friends-ask-me-for-advice-about-hinge-prompt-answers.mdx
9. ✅ im-weirdly-attracted-to-hinge-prompt-answers.mdx
10. ✅ i-wont-shut-up-about-hinge-prompt-answers.mdx
11. ✅ i-know-the-best-spot-in-town-for-hinge-prompt-answers.mdx
12. ✅ i-beat-my-blues-by-hinge-prompt-answers.mdx
13. ✅ i-geek-out-on-hinge-prompt-answers.mdx
14. ✅ tinder-statistics.mdx
15. ✅ my-best-celebrity-impression-hinge-prompt-answers.mdx
16. ✅ my-best-dad-joke-hinge-prompt-answers.mdx
17. ✅ my-most-controversial-opinion-is-hinge-prompt-answers.mdx
18. ✅ dating-profile-photos-that-get-girls-to-notice-you.mdx
19. ✅ my-bffs-reasons-for-why-you-should-date-me-hinge-prompt-answers.mdx
20. ✅ most-spontaneous-thing-ive-done-hinge-prompt-answers.mdx
21. ✅ lets-make-sure-were-on-the-same-page-about-hinge-prompt-answers.mdx
22. ✅ my-cry-in-the-car-song-is-hinge-prompt-answers.mdx
23. ✅ my-biggest-date-fail-hinge-prompt-answers.mdx
24. ✅ im-looking-for-hinge-prompt-answers.mdx
25. ✅ lets-chat-about-hinge-prompt-answers.mdx
26. ✅ ill-pick-the-topic-if-you-start-the-conversation-hinge-prompt-answers.mdx
27. ✅ my-favourite-line-from-a-film-hinge-prompt-answers.mdx
28. ✅ my-greatest-strength-hinge-prompt-answers.mdx
29. ✅ if-loving-this-is-wrong-i-dont-want-to-be-right-hinge-prompt-answers.mdx
30. ✅ lets-debate-this-topic-hinge-prompt-answers.mdx
31. ✅ im-convinced-that-hinge-prompt-answers.mdx
32. ✅ ill-brag-about-you-to-my-friends-if-hinge-prompt-answers.mdx
33. ✅ id-fall-for-you-if-hinge-prompt-answers.mdx
34. ✅ the-league-review.mdx
35. ✅ raya-review.mdx
36. ✅ i-feel-most-supported-when-hinge-prompt-answers.mdx
37. ✅ i-hype-myself-up-by-hinge-prompt-answers.mdx
38. ✅ i-unwind-by-hinge-prompt-answers.mdx
39. ✅ when-do-tinder-likes-reset.mdx
40. ✅ i-recently-discovered-that-hinge-prompt-answers.mdx
41. ✅ i-wish-more-people-knew-hinge-prompt-answers.mdx
42. ✅ how-to-pronounce-my-name-hinge-prompt-answers.mdx
43. ✅ i-want-someone-who-hinge-prompt-answers.mdx
44. ✅ guess-the-song-hinge-prompt-answers.mdx
45. ✅ getting-personal-hinge-prompt-answers.mdx
46. ✅ first-round-is-on-me-if-hinge-prompt-answers.mdx
47. ✅ dont-hate-me-if-i-hinge-prompt-answers.mdx
48. ✅ do-you-agree-or-disagree-that-hinge-prompt-answers.mdx
49. ✅ coffee-meets-bagel-review.mdx
50. ✅ badoo-review.mdx
51. ✅ hinge-review.mdx
52. ✅ tinder-insights-review.mdx
53. ✅ best-rizz-pickup-lines.mdx
54. ✅ apparently-my-lifes-soundtrack-is-hinge-prompt-answers.mdx
55. ✅ best-travel-story-hinge-prompt-answers.mdx
56. ✅ biggest-risk-ive-taken-hinge-prompt-answers.mdx
57. ✅ change-my-mind-about-hinge-prompt-answers.mdx
58. ✅ all-i-ask-is-that-you-hinge-prompt-answers.mdx
59. ✅ a-thought-i-recently-had-in-the-shower-hinge-prompt.mdx
60. ✅ a-quick-rant-about-hinge-prompt-answers.mdx
61. ✅ a-boundary-of-mine-is-hinge-prompt-answers.mdx
62. ✅ a-random-fact-i-love-is-hinge-prompt-answers.mdx
63. ✅ a-life-goal-of-mine-hinge-prompt-answers.mdx
64. ✅ well-get-along-if-hinge-prompt-answers.mdx
65. ✅ dating-me-is-like-hinge-prompt-answers.mdx
66. ✅ my-therapist-would-say-i-hinge-prompt-answers.mdx
67. ✅ together-we-could-hinge-prompt.mdx
68. ✅ i-go-crazy-for-hinge-prompt.mdx
69. ✅ how-to-get-more-matches-on-tinder-as-a-man.mdx
70. ✅ green-flags-i-look-out-for-hinge-prompt.mdx
71. ✅ doublelist-review.mdx
72. ✅ give-me-travel-tips-for-hinge-prompt-answers.mdx

---

## Notes

- All posts by "Paw" except "Dating Profile Photos That Get Girls to Notice You" by Joe Buchoff
- Most posts are Hinge prompt guides
- Several dating app reviews included (Elite Singles, Raya, The League, etc.)
- Content currently lives in Prismic CMS
