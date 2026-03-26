export function slugify(originalText: string): string {
  originalText = originalText.replace(/^\s+|\s+$/g, ""); // trim
  originalText = originalText.toLowerCase();
  
  // remove accents, swap ñ for n, etc
  const from = "àáäâèéëêìíïîòóöôùúüûñç·/_,:;";
  const to = "aaaaeeeeiiiioooouuuunc------";
  for (let i = 0, l = from.length; i < l; i++) {
    originalText = originalText.replace(new RegExp(from.charAt(i), "g"), to.charAt(i));
  }
  
  originalText = originalText
    .replace(/[^a-z0-9 -]/g, "") // remove invalid chars
    .replace(/\s+/g, "-") // collapse whitespace and replace by -
    .replace(/-+/g, "-"); // collapse dashes
  
  return originalText;
}