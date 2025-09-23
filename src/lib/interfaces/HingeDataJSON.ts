export interface SwipestatsHingeProfilePayload {
  hingeId: string;
  anonymizedHingeJson: AnonymizedHingeDataJSON;
}

// ============================================================================
// Individual Hinge Export File Interfaces (based on actual data structure)
// ============================================================================

export interface UserData {
  preferences: Preferences;
  identity: Identity;
  account: Account;
  installs: Install[];
  profile: Profile;
}

export interface Preferences {
  distance_miles_max: number;
  age_min: number;
  age_max: number;
  age_dealbreaker: boolean;
  height_min: number;
  height_max: number;
  height_dealbreaker: boolean;
  gender_preference: string;

  /** NOTE: In the raw JSON these are JSON-encoded arrays (`"[\"…\"]"`).
   *  If you parse them into real arrays, change the type to `string[]`. */
  ethnicity_preference: string;
  ethnicity_dealbreaker: boolean;

  religion_preference: string;
  religion_dealbreaker: boolean;

  smoking_preference: string;
  smoking_dealbreaker: boolean;

  drinking_preference: string;
  drinking_dealbreaker: boolean;

  marijuana_preference: string;
  marijuana_dealbreaker: boolean;

  drugs_preference: string;
  drugs_dealbreaker: boolean;

  children_preference: string;
  children_dealbreaker: boolean;

  family_plans_preference: string;
  family_plans_dealbreaker: boolean;

  education_attained_preference: string;
  education_attained_dealbreaker: boolean;

  politics_preference: string;
  politics_dealbreaker: boolean;
}

export interface Identity {
  email: string;
  fbid: string;
  instagram_authorized: boolean;
  phone_number: string;
}

export interface Account {
  signup_time: string; // ISO timestamp
  last_pause_time: string;
  last_unpause_time: string;
  last_seen: string;
  device_platform: string;
  device_os: string;
  device_model: string;
  app_version: string;
  push_notifications_enabled: boolean;
  last_uninstall_time: string;
}

export interface Install {
  ip_address: string;
  idfa: string;
  idfv: string;
  network_name: string;
  install_time: string; // ISO timestamp
}

export interface Profile {
  first_name: string;
  last_name: string;
  age: number;
  height_centimeters: number;
  gender: string;

  /** JSON-encoded arrays in source – convert to `string[]` if parsed */
  ethnicities: string;
  ethnicities_displayed: boolean;

  religions: string;
  religions_displayed: boolean;

  workplaces_displayed: boolean;
  job_title: string;
  job_title_displayed: boolean;

  schools: string;
  schools_displayed: boolean;

  hometowns: string;
  hometowns_displayed: boolean;

  smoking: string;
  smoking_displayed: boolean;
  drinking: string;
  drinking_displayed: boolean;
  marijuana: string;
  marijuana_displayed: boolean;
  drugs: string;
  drugs_displayed: boolean;

  children: string;
  children_displayed: boolean;
  family_plans: string;
  family_plans_displayed: boolean;

  education_attained: string;
  politics: string;
  politics_displayed: boolean;

  instagram_displayed: boolean;
  dating_intention_displayed: boolean;
  dating_intention: string;

  relationship_type_displayed: boolean;
  relationship_types: string;
}

/** A single entry from the prompts data */
export interface PromptEntry {
  /** Autoincrementing primary key */
  id: number;

  /** The question or prompt shown to the user */
  prompt: string;

  /**
   * The format of the response.
   * Currently only `"text"` appears, but a union is handy
   * if you later support images, audio, etc.
   */
  // eslint-disable-next-line @typescript-eslint/no-redundant-type-constituents
  type: "text" | "image" | "audio" | "video" | string;

  /** The user-supplied answer */
  text?: string; // ? surprisingly, this can be undefined.

  /** Last time the user edited this entry (ISO-8601 string) */
  user_updated: string;

  /** Time the entry was first created (ISO-8601 string) */
  created: string;
}

export type PromptEntryList = PromptEntry[];

/** A single chat message within a conversation thread */
export interface ChatMessage {
  body: string;
  timestamp: string; // ISO-8601 timestamp
}

/** An individual "like" reaction (may include an optional comment) */
export interface LikeReaction {
  timestamp: string;
  comment?: string;
}

/** A top-level "like" event that can contain one or more reactions */
export interface LikeEntry {
  timestamp: string;
  like: LikeReaction[];
}

/** A match event (one per conversation thread, historically) */
export interface MatchEntry {
  timestamp: string;
}

/** A block or removal event on a profile */
export interface BlockEntry {
  block_type: string; // e.g. "remove"
  timestamp: string;
}

/** "We met" follow-up data reported after an IRL meeting */
export interface WeMetEntry {
  timestamp: string;
  did_meet_subject: string; // usually "Yes" | "No" but keep open-ended
}

/** All possible content for a single match thread.
 *  Keys are optional because some threads only have chats,
 *  others only likes/blocks/etc.
 */
export interface ConversationThread {
  chats?: ChatMessage[];
  like?: LikeEntry[];
  match?: MatchEntry[];
  block?: BlockEntry[];
  we_met?: WeMetEntry[];
}

/** Entire dataset (root of the JSON you provided) */
export type Conversations = ConversationThread[];

// Legacy types for backward compatibility - may be removed later
export type HingeUserFileExport = UserData;
export type HingeMatchesFileExport = Conversations;
export type HingePromptsFileExport = PromptEntryList;
export type HingeMediaFileExport = unknown; // Not yet defined
export type HingeSubscriptionsFileExport = unknown; // Not yet defined

// ============================================================================
// Combined Payload Interface (our current working interface)
// This represents the merged structure after combining all individual files
// ============================================================================

interface HingeDataJSONBase {
  // Core Hinge data structure based on actual export format
  User: UserData;
  Prompts: PromptEntryList;
  Matches: Conversations;
  // These may not exist in all exports
  Media?: unknown[];
  Subscriptions?: unknown[];
}

export interface AnonymizedHingeDataJSON
  extends Omit<HingeDataJSONBase, "User"> {
  User: AnonymizedHingeUser;
}

export interface FullHingeDataJSON extends HingeDataJSONBase {
  User: UserData;
}

// Create anonymized user interface based on the actual UserData structure
export interface AnonymizedHingeUser {
  preferences: Preferences;
  identity: Omit<Identity, "email" | "phone_number"> & {
    has_email: boolean;
    has_phone: boolean;
    instagram_authorized: boolean;
  };
  account: Account;
  installs: Omit<Install, "ip_address" | "idfa" | "idfv">[];
  profile: Omit<Profile, "first_name" | "last_name"> & {
    has_first_name: boolean;
    has_last_name: boolean;
  };
}

// Helper interface for validation - extract key fields we need
export interface HingeValidationData {
  birth_date?: string;
  create_date?: string;
  signup_time?: string;
  age?: number;
}
