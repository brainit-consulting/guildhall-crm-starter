# A check-in task for cold deals

When a deal goes cold, give me one reminder to get back in touch.

## What it should do
- When Home loads, every cold deal (the `isCold` rule) that has no open check-in task gets one: "Check in with
  <contact name> about <deal title>", due today.
- One at a time: while that task is open, no second one is made.
- Logging an activity on the deal (or ticking the task done) starts it over: if the deal goes cold again later, it
  gets a new check-in task then.
- No timers or scheduled jobs: it happens when Home loads.

## Done when
- [ ] A deal cold for 15 days gets one check-in task; reloading Home doesn't add another.
- [ ] After I log a call, the deal isn't cold; 14 days later it gets a new task.
- [ ] Tests: integration tests for "one at a time" and for starting over.
- [ ] Tried in a browser
