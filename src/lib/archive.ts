// The Archive listing shown in the 2D archive overlay. Derived from the
// archive wing of lib/projects.ts — add new experiments there (wing:
// 'archive') and they appear both here and as sculptures in the plaza garden.
import { getProjectsByWing } from './projects';

export type ArchiveItem = {
  slug: string;
  title: string;
  medium: string;
  note: string;
  link?: { label: string; url: string };
};

export const ARCHIVE: ArchiveItem[] = getProjectsByWing('archive').map((p) => ({
  slug: p.slug,
  title: p.title,
  medium: p.medium,
  note: p.blurb,
  link: p.link,
}));

export const ARCHIVE_PLACARD =
  "The collection is still growing. New work is acquired here as it's made.";
