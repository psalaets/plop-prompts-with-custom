import test from 'node:test';
import { strict as assert } from 'node:assert';
import { promptsWithCustom } from './index.js';

function mockInquirer(answersByName) {
  return {
    prompt(promptObject) {
      return new Promise((resolve, reject) => {
        const answers = answersByName[promptObject.name];
        if (answers) {
          resolve(answers);
        } else {
          reject(new Error(`No answers mocked for prompt name: ${promptObject.name}`));
        }
      });
    }
  }
}

test('promptsWithCustom', async (t) => {
  await t.test('Is a function', (t) => {
    assert(typeof promptsWithCustom, 'function');
  });

  await t.test('Throws when prompts are not in an array', async (t) => {
    try {
      await promptsWithCustom(
        // These prompt objects are not wrapped in an array
        {
          type: 'input',
          name: 'name'
        },
        {
          type: 'input',
          name: 'other'
        }
      );

      assert.fail('Expected to throw');
    } catch (error) {
      // success
    }
  });

  await t.test('Collects answers from prompts', async (t) => {
    const inquirer = mockInquirer({
      name: {name: 'foo'},
      count: {count: 5},
    });

    const answers = await promptsWithCustom([
      {
        type: 'input',
        name: 'name'
      },
      async function(inquirer) {
        return {
          custom: 'ok'
        };
      },
      {
        type: 'input',
        name: 'count'
      },
    ])(inquirer);

    assert.deepEqual(answers, {
      name: 'foo',
      count: 5,
      custom: 'ok'
    });
  });

  await t.test('Later answers clobber earlier answers when names collide', async () => {
    const inquirer = mockInquirer({
      custom: {custom: 'early'},
    });

    const answers = await promptsWithCustom([
      {
        type: 'input',
        name: 'custom'
      },
      async function(inquirer) {
        return {
          custom: 'later'
        };
      },
    ])(inquirer);

    assert.deepEqual(answers, {
      custom: 'later'
    });
  });
});
