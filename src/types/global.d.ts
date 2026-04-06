/** Union type representing all base JS types. */
type AllType = Function | string | number | boolean | object | symbol | bigint;

/** Utility type that removes all fields from `T` whose value type extend `U`. */
type OmitByValue<T, U> = {
  [K in keyof T as U extends T[K] ? never : K]: T[K];
};

/** Utility type that pick all fields from `T` whose value type extend `U`. */
type PickByValue<T, U> = {
  [K in keyof T as U extends T[K] ? K : never]: T[K];
};

/** Strict version OmitByValue. */
type OmitByValueStrict<T, U> = {
  [K in keyof T as T[K] extends U ? never : K]: T[K];
};

/** Strict version PickByValue. */
type PickByValueStrict<T, U> = {
  [K in keyof T as T[K] extends U ? K : never]: T[K];
};

/** Type representing all falsy values. */
type Falsy = "" | 0 | false | null | undefined;

/** Type representing all truthy values. */
type Truthy = Exclude<AllType, Falsy>;

/** Returns `TrueType` if `T` is not falsy, otherwise `FalseType`. */
type IsTruthy<T, TrueType = T, FalseType = never> = [T] extends [Falsy] ? FalseType : TrueType;

/** Returns `TrueType` if `T` is falsy, otherwise `FalseType`. */
type IsFalsy<T, TrueType = T, FalseType = never> = [T] extends [Falsy] ? TrueType : FalseType;

/** Returns `TrueType` if `T` is array, otherwise `FalseType`. */
type IsArray<T, TrueType = T, FalseType = never> = [T] extends [any[]] ? TrueType : FalseType;

/** IsArray but not strict. */
type IncludeArray<T, TrueType = T, FalseType = never> = T extends any[] ? TrueType : FalseType;

/** Extracts the element type of an array `T`. */
type ExtractArray<T> = T extends (infer U)[] ? U : T;

/** Conditionally adds a new field to a type `T`. */
type ConditionalField<T, Key extends string, ExtraKey extends string, ExtraType> = IsFalsy<T[Key], T, T & { [K in ExtraKey]: ExtraType }>;

/** Replaces all occurrences of substring `W` in string `S` with `R`. */
type Replace<S extends string, F extends string, R extends string> = S extends `${infer First}${F}${infer Last}` ? `${First}${R}${Last}` : S;

/** Shortcut of `T[keyof T]` */
type ValueOf<T> = T[keyof T];

/** Only one field allowed in `T` */
type OneFieldOnly<T extends Record<string, unknown>> = {
  [K in keyof T]: {
    [P in K]: T[P];
  } & {
    [P in Exclude<keyof T, K>]?: never;
  };
}[keyof T];

/** Required at least one of `T` */
type RequireAtLeastOne<T, Keys extends keyof T = keyof T> = Pick<T, Exclude<keyof T, Keys>> &
  {
    [K in Keys]-?: Required<Pick<T, K>> & Partial<Pick<T, Exclude<Keys, K>>>;
  }[Keys];

/** Merge from union to intersection */
type MergeUnion<U> = (U extends any ? (k: U) => void : never) extends (k: infer I) => void ? I : never;
