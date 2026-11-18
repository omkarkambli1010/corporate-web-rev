/* Types shared by <RiveAnimation> and the lazily loaded player. Kept apart
   from RivePlayer so importing them never pulls the Rive runtime in. */

/** View Model properties the page writes, by name. */
export type RiveValues = Readonly<Record<string, boolean | number | string>>;

/**
 * Content for a View Model list property: one item instance per entry, built
 * from the named item View Model. Images are URLs, fetched and decoded on load.
 */
export interface RiveSlides {
  /** The list property on the default View Model, e.g. "slides". */
  list: string;
  /** The View Model each list item is an instance of, e.g. "CsrSlide". */
  viewModel: string;
  items: ReadonlyArray<{
    images?: Readonly<Record<string, string>>;
    strings?: Readonly<Record<string, string>>;
  }>;
}
