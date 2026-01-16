import {describe, it, expect} from 'vitest'
import ImportantDateCollection, {createImportantDateCollection} from "../ImportantDateCollection.ts";
import {createImportantDate} from "../ImportantDate.ts";


describe('ImportantDateCollection', () => {
    describe('createImportantDateDollection creates', () => {
        it('as empty', () => {
            const importantDateCollection: ImportantDateCollection = createImportantDateCollection([]);
            expect(importantDateCollection.isEmpty()).toBe(true);
            expect(importantDateCollection.size).toBe(0);
        });
        it('with one ImportantDate', () => {
            const importantDate = createImportantDate({
                date: new Date('1990-05-15'),
                description: 'Birthday',
            })
            const importantDateCollection: ImportantDateCollection = createImportantDateCollection([importantDate]);
            expect(importantDateCollection.isEmpty()).toBe(false);
            expect(importantDateCollection.size).toBe(1);
        });
    });
});
