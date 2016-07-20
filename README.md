# Template grid single item widget

Pretend to change an existing object in an offline page

## Contributing

For more information on contributing to this repository visit [Contributing to a GitHub repository](https://world.mendix.com/display/howto50/Contributing+to+a+GitHub+repository)!

## Typical usage scenario

Offline app pages where the user intends to change an existing object.
 
## Description

Offline apps can only create new object, changing existing objects is not possible. To simulate a change to an object, a new object must be created. To hide this from the user, this widget can be used next to a standard template grid to show either the new or the edit button. When no items exist in the grid, the new button is shown, when an item exists the edit button is shown. This hides the technicalities from the user and also prevents users from creating multiple objects.

### Properties

The widget finds the new and edit button using CSSclass names. These classes need not exist in your CSS. You can also copy the defaults to your buttons.