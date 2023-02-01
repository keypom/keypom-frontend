# Contributing to Parcel + React Boilerplate

We would love for you to contribute to Parcel + React Boilerplate and help make it even better than it is today! As a contributor, here are the guidelines we would like you to follow:

- [Contributing to Parcel + React Boilerplate](#contributing-to-parcel--react-boilerplate)
  - [Getting Started](#getting-started)
  - [Issues](#issues)
    - [Questions](#questions)
    - [Help Wanted](#help-wanted)
    - [Bugs](#bugs)
    - [Features](#features)
  - [Pulls Requests](#pulls-requests)
  - [Submission Guidelines](#submission-guidelines)
    - [Submitting an Issue](#submitting-an-issue)
    - [Submitting a Pull Request](#submitting-a-pull-request)

## Getting Started

Start by **starring** the repo or [forking](https://github.com/ayungavis/parcel-react-typescript/fork) it. Go through the [GitHub Community Guidelines](https://help.github.com/en/github/site-policy/github-community-guidelines) to have a better understanding about `DOS` and `DON'TS` in the open source community.

## Issues

The issues can be [opened](#submitting-an-issue) on our [GitHub Repository][github] and used for the following purposes adhering to their respective guidelines:

### Questions

If you have a general question related to documentation or anything in particular to ours, please elaborate it as much as possible so that we can have a good understanding and provide you with the best possible answer.

### Help Wanted

We'd be happy to help you to the best of our knowledge with any blockers that you have while making a documentation for your projects.

### Bugs

If you find a bug, typo or something invalid in the documentation, you can help us by mentioning where exactly it is and how it can be corrected. It would be even better if you [submit a Pull Request](#submitting-a-pull-request) with a fix.

### Features

There are two scenario's for features:

- **_Requesting_** a new feature by provide a comprehensive explanation of your idea
- **_Implementing_** a new feature for the project by submitting an issue with a proposal for your work first, to be sure that we can use it and then later [submitting a Pull Request](#submitting-a-pull-request) with the implementation. A brief explanation would be enough

## Pulls Requests

Pull requests are, a great way to get your ideas into this repository. PRs can be [opened](#submitting-a-pull-request) on our [GitHub Repository][github] and used for the following purposes adhering to their respective guidelines

When deciding if we merge in a pull request, we look for the following things:

- improves the project in the direction of our vision
- follows the contributor covenant
- states the intent
- is of good quality
  - no spelling mistakes
  - good grammer

## Submission Guidelines

### Submitting an Issue

Before you submit an issue, please search the [Issue tracker](https://github.com/ayungavis/parcel-react-typescript/issues) for an existing issues that might be similar to your problem and the discussion might inform you of workarounds readily available.

We want to fix all the issues as soon as possible, but before fixing them, we have do check on our end to make sure everything is perfect. To speed up things, please provide all the information that you think might be relavant to it.

If we don't hear back from you, we are going to close the issue that we think don't have enough info to be reproduced.

### Submitting a Pull Request

Before you submit a Pull Request (PR), consider the following guidelines, search the repo for an open or closed [PR tracker](https://github.com/ayungavis/parcel-react-typescript/pulls) that relates to your submission. You don't want to duplicate effort.

Follow these steps and guidelines when starting with a PR:

- Make your changes in a new local git branch:
  ```shell
  git checkout -b BRANCH_NAME origin/master
  ```
- Use one branch per fix / feature
- Follow our [Coding Rules](#coding-rules)
- Commit your changes

  - Please provide a git message that explains what you've done
  - Make sure your commit messages follow the [conventional guidelines](https://gist.github.com/robertpainsi/b632364184e70900af4ab688decf6f53#file-commit-message-guidelines-md)
  - Commit to the forked repository

    Example :pencil2: :

    ```
    $ git commit -am 'Adding Details in Deployment Section'
    ```

  - Push to the branch in the forked repository
    Example :pencil2: :
    ```
    $ git push origin BRANCH_NAME
    ```

After making sure that all above guidelines have been followed completely,

- Make a pull request to the `master` branch in the [main repo][github]
- If we suggest any changes then make the required updates
- If we don't hear back from you for a while, we are going to close the PR if it doesn't meet the guidelines
- Make sure there are no merge conflicts
- Once your PR is approved and you are done with any follow up changes:

  - Rebase to the current master to pre-emptively address any merge conflicts.

    ```shell
    git rebase master -i
    git push -f
    ```

  - Add the `PR action: merge` label

- The current caretaker will merge the PR to the target branch(es) within 1-2 business days.

That's it! Thank you for your contribution! 🎉

[github]: https://github.com/ayungavis/parcel-react-typescript
