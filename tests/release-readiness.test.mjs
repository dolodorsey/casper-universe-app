import assert from 'node:assert/strict'
import fs from 'node:fs'
import test from 'node:test'

const read = path => fs.readFileSync(new URL(`../${path}`, import.meta.url), 'utf8')

test('health contract keeps Casper blocked until canonicalization', () => {
  const health = JSON.parse(read('public/health.json'))
  assert.equal(health.app, 'casper-universe-app')
  assert.equal(health.status, 'blocked')
  assert.equal(health.release_gate, 'canonicalization-required')
})

test('handoff requires brand separation and pilot rollback', () => {
  const handoff = read('docs/HANDOFF.md')
  assert.match(handoff, /brand separation/i)
  assert.match(handoff, /pilot/i)
  assert.match(handoff, /legacy systems/i)
})
