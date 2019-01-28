import slug from 'slug';

export function slugifyName(name: String): String {
  return slug(name.toLowerCase());
}
