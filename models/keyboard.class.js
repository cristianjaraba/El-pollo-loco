/**
 * Simple state container tracking which control keys are currently
 * pressed. Updated by keyboard/touch event handlers and read each
 * frame by {@link Character#checkKeyboardInput} to drive movement.
 */
class Keyboard{
    /** @type {boolean} Whether the left movement control is currently pressed. */
    LEFT = false;
    /** @type {boolean} Whether the right movement control is currently pressed. */
    RIGHT = false;
    /** @type {boolean} Whether the down control is currently pressed (currently unused). */
    DOWN = false;
    /** @type {boolean} Whether the up control is currently pressed (currently unused). */
    UP = false;
    /** @type {boolean} Whether the jump control is currently pressed. */
    SPACE = false;
    /** @type {boolean} Whether the throw-bottle control is currently pressed. */
    D = false;
}