export = goto;
/**
   * Adds a easy-to-use API wrapper for quickly executing a goal and running
   * a callback when that goal is reached. This function serves to remove a
   * lot of boilerplate code for quickly executing a goal.
   *
   * @param {Bot} bot - The bot.
   * @param {Goal} goal - The goal to execute.
   * @returns {Promise} - resolves on success, rejects on error
   */
declare function goto(bot: Bot, goal: Goal): Promise<any>;
//# sourceMappingURL=Goto.d.ts.map