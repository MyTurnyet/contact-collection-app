import type { ImportantDate } from "../ImportantDate";
import BaseCollection from "./BaseCollection";

class ImportantDateCollection extends BaseCollection<ImportantDate> {}

export default ImportantDateCollection;

export function createImportantDateCollection(
  items: ImportantDate[],
): ImportantDateCollection {
  return new ImportantDateCollection(items);
}
