/**
 * Unique identifier of each predefined `Distortion`.
 *
 * @readOnly
 */
export type DistortionID = string

/**
 * A predefined cognitive distortion. One of the logical fallacies behind automatic thoughts.
 *
 * @readOnly
 */
export type Distortion = {
  /**
   * Unique identifier for this distortion
   */
  slug: DistortionID

  /**
   * Emoji icons representing this distortion. Second icon is a fallback, used only if the first is not supported.
   * @minItems 1
   * @maxItems 2
   */
  emoji: string[]

  /**
   * i18n key for the name of this distortion. If omitted, use `<snake_cased_slug>`
   */
  labelKey?: string

  /**
   * i18n key for the long description of this distortion. If omitted, use `<snake_cased_slug>_description`
   */
  descriptionKey?: string
}

export type DistortionData = {
  $schema?: string
  data: Distortion[]
}

/**
 * Unique identifier of each thought.
 *
 * @readOnly
 */
export type ThoughtID = string

/**
 * A single Cognitive Behavioral Therapy (CBT) exercise written by the user.
 */
export type Thought = {
  /**
   * The distressing automatic negative thought. Prompted the user to do this exercise.
   */
  automaticThought: string

  /**
   * A list of the logical fallacies behind this automatic thought. Chosen from a list of predefined distortions.
   */
  cognitiveDistoritions: DistortionID[]

  /**
   * Why doesn't the automatic thought make sense? What are the problems with it? Based on the selected distortions.
   */
  challenge: string

  /**
   * What could we think instead? What's a less distressing thought we could replace the automatic thought with?
   */
  alternativeThought: string

  /**
   * Date this thought was first recorded. Automatically initialized.
   *
   * @readOnly
   */
  createdAt: Date

  /**
   * Date this thought was last edited. Automatically updated.
   *
   * @readOnly
   */
  updatedAt: Date

  /**
   * Random unique thought ID. Automatically initialized.
   *
   * @readOnly
   */
  uuid: ThoughtID
}

/**
 * A manually exported saved file, full of all of a user's thought exercises.
 */
export type Archive = {
  /**
   * A list of the user's thoughts.
   */
  thoughts: Thought[]

  /**
   * Date this archive was created. Automatically initialized.
   *
   * @readOnly
   */
  createdAt: Date
}
