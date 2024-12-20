# plop-prompts-with-custom

Mix custom prompt functions with prompt objects.

## What is this?

When defining a plop generator, the `prompts` property can be

- `Array<PromptQuestion>` - Array of prompt config objects, or
- `DynamicPromptsFunction` - Function that returns a Promise of prompt answers.

This module allows `prompts` to effectively be `Array<PromptQuestion | DynamicPromptsFunction>`.

## Install

```
npm install -D plop-prompts-with-custom
```

## Usage

```js
import { promptsWithCustom } from 'plop-prompts-with-custom';

// plopfile.js
export default function(plop) {
  plop.setGenerator('controller', {
    prompts: promptsWithCustom([
      // Regular prompt
      {
        type: 'input',
        name: 'id',
        message: 'Enter id'
      },
      // Custom prompts function
      async function(inquirer) {
        // Do something async here

        // Return answers object
        return {
          count: 5,
          flag: true
        };
      },
      // Another regular prompt
      {
        type: 'input',
        name: 'name',
        message: 'Enter name'
      }
    ]),
    actions: [
      // ...
    ]
  });
};
```

## License

MIT
