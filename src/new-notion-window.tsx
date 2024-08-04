import { runAppleScript } from "run-applescript";
import { popToRoot } from "@raycast/api";
import os from "os";
import { useEffect } from "react";

export default function Command() {
  useEffect(() => {
    async function runScript() {
      try {
        const username = os.userInfo().username;
        const folderPath = `/Users/${username}/Documents`; // Change this to your desired folder path
        const script = `
        tell application "System Events"
          tell process "Dock"
            set frontmost to true
            -- Get the list of dock items
            set dockItems to UI elements of list 1
            
            -- Iterate through dock items to find Notion
            repeat with dockItem in dockItems
              if name of dockItem is "Notion" then
                -- Perform control-click (right-click with control key)
                key down control
                perform action "AXShowMenu" of dockItem
                key up control
                
                -- Wait for the menu to appear and find the "New Window" item
                tell menu 1 of dockItem
                  repeat until exists menu item "New Window"
                    delay 0.01 -- Minimal delay to allow the menu to appear
                  end repeat
                  click menu item "New Window"
                end tell
                
                exit repeat
              end if
            end repeat
          end tell
        end tell
        `;

        await runAppleScript(script);
        await popToRoot();
      } catch (error) {
        console.error("Error running script:", error);
      }
    }

    runScript();
  }, []);

  return;
}
