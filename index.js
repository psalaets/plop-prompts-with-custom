/**
 * @typedef {import('plop').PlopGeneratorConfig['prompts']} Prompts
 *
 * @typedef {Exclude<Prompts, Array<any>>} DynamicPromptsFunction
 * @typedef {Extract<Prompts, Array<any>>[number]} PromptQuestion
 * @typedef {PromptQuestion | DynamicPromptsFunction} Prompt
 */

/**
 * @param {Array<Prompt>} prompts
 */
export function promptsWithCustom(prompts) {
  if (!Array.isArray(prompts)) {
    throw new Error('prompts must be an array');
  }

  /**
   * @type {DynamicPromptsFunction}
   */
  const customPrompt = async function customPrompt(inquirer) {
    const answers = [];

    for (const prompt of prompts) {
      if (typeof prompt === 'function') {
        answers.push(await prompt(inquirer));
      } else {
        answers.push(await inquirer.prompt(prompt));
      }
    }

    return Object.assign({}, ...answers);
  };

  return customPrompt;
}
