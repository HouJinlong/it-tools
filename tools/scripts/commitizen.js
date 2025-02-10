const devkit = require('@nx/devkit');
const { readCachedProjectGraph } = devkit;
const graph = readCachedProjectGraph();
const AddSpaces = (str) => {
    while (str.length < 14) {
        str += ' ';
    }
    return str;
}
const types = [
    { "type": "feat", "section": "✨ Features", "git": "✨  A new feature" },
    { "type": "fix", "section": "🐛 Bug Fixes", "git": "🐛  A bug fix" },
    { "type": "docs", "section": "📝 Documentation", "git": "📝  Documentation only changes" },
    { "type": "style", "section": "💄 Styles", "git": "💄  Styles only changes" },
    { "type": "refactor", "section": "🧹 Code Refactoring", "git": "🧹  A code change that neither fixes a bug nor adds a feature" },
    { "type": "perf", "section": "⚡️ Performance Improvements", "git": "⚡️  A code change that improves performance" },
    { "type": "test", "section": "✅ Tests", "git": "✅  Adding missing tests or correcting existing tests" },
    { "type": "build", "section": "🛠️  Build System", "git": "🛠️   Changes that affect the build system or external dependencies" },
    { "type": "chore", "section": "🏡  Chores", "git": "🏡  Other changes that don't modify src or test files" },
    { "type": "ci", "section": "🤖 Continuous Integration", "git": "🤖  Changes to our CI configuration files and scripts" },
]

/** @type {import('cz-git').CommitizenGitOptions} */
module.exports = {
   "alias": {
      // cz_alias=temp cz
      "temp": "feat(temp): 参数化",
    },
    scopes: Object.values(graph.nodes).map(v => v.name),
    allowEmptyScopes: false,
    allowCustomScopes: false,
    scopesSearchValue: true,
    maxSubjectLength: 100,
    allowBreakingChanges: [],
    types: types.map(v => {
        return {
            value: v.type,
            name: `${AddSpaces(`${v.type}:`)}${v.git}`
        }
    }),
};


