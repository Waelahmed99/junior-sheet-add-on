# junior-sheet-add-on
Sheet Automation is an add-on that automates setting the verdict of problems in [Mostafa Saad's junior sheet](https://docs.google.com/spreadsheets/d/1iJZWP2nS_OB3kCTjq8L6TrJJ4o-5lhxDOyTaocSYc-k/).

## Use as a library
Currently, you can install this add-on as a library (You have to write one or two lines of code).
- Open your Junior training sheet 
- Extension tab -> Apps Scripts
- Add a library through the '+' button on the left
- Enter the Script ID: `1W2XNXACyH9q8BTv82MnKxoahZF2IjUEz1PUYkr2pJXb3OSloNNgIuBnb`
- Click Add
- Remove everything on Code.gs
- Add the following line of code, then run the code (onOpen function)
  ```
      const onOpen = (e) => SheetAutomation.createMenu('SheetAutomation')
  ```
> If you changed the name while adding the library, make sure to pass the correct name as a parameter.

## Current progress
Currently the add-on fetches only `Codeforces` and `UVA` submissions, which is good as the sheet is 90% CF & UVA.


https://user-images.githubusercontent.com/45833151/137760409-f426a3a8-f5d7-428a-841c-bc075bd065a6.mp4
