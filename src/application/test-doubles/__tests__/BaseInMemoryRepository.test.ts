import { describe, it, expect } from 'vitest'
import { BaseInMemoryRepository } from '../BaseInMemoryRepository'

type TestEntity = {
  id: string
  name: string
}

class TestRepository extends BaseInMemoryRepository<TestEntity, string, TestEntity[]> {
  protected extractId(entity: TestEntity): string {
    return entity.id
  }

  protected createCollection(entities: TestEntity[]): TestEntity[] {
    return entities
  }
}

describe('BaseInMemoryRepository', () => {
  it('clear should remove all entities', async () => {
    const repo = new TestRepository()

    await repo.save({ id: '1', name: 'A' })
    await repo.save({ id: '2', name: 'B' })

    repo.clear()

    expect(await repo.findById('1')).toBeNull()
    expect(await repo.findById('2')).toBeNull()
    expect(await repo.findAll()).toEqual([])
  })
})
