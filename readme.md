# Webview Modal Automated Prompt

## About

This macro serves as an example on how you can open up a WebView Modal on the Cisco Room Navigator.

Great starting point when first working with Webview Display APIs.

## Features
- Automatic UI Generation
- WebView Target Detection
  - Determines whether to show on the OSD or Navigator based on available resources
- OSD User Tool Tips
- Simple Configuration
- Cache Handling

## Installation
- Download a copy of the webview-modal-automated-prompt.js Macro
- Login into the Web Interface of your Device
- Navigate to the Macro Editor
- Select Import from file, and add the webview-modal-automated-prompt.jr file
- Alter the ```config``` object of the Macro
- Save the Macro
- Activate the Macro

## Use Cases
- Post Meeting Surveys
- Service Ticket Portal
- Ordering Coffee 😅

## Configuration

> The webview-modal-automated-prompt.js macro has an object near the top of the script. In it, are a few items you can change on the fly to alter the user experience of the Macro. To the right of each nested object is a list of accepted values and a description of each Value

### CodeView

```javascript
const config = {
  WebModal: {
    Title: 'Cisco',                     // AcceptedValues: String || Description: Set a user facing title for the Web Modal
    Url: 'https://cisco.com',           // AcceptedValues: String || Description: Set the URL you want to open
    OSDToolTip: {
      Mode: true,                       // AcceptedValues: Boolean || Description: Enable or Disable the OSD Message. NOTE: Will only show on non-user initiated sequenced like Call Disconnects
      Message: 'Tell us about your experience on the Touch Panel 🙂', // AcceptedValues: String || Description: Edit the On Screen OSD Message
      Duration: 15,                     // AcceptedValues: Integer || Description: Set the Duration of the OSD Message
      Location: 'Top-Right',            // AcceptedValues: 'Top-Right', 'Top-Left', 'Center', 'Bottom-Right', 'Bottom-Left' || Description: Set the Position of the OSD Message
    },
    Triggers: {
      PanelClicked: true,               // AcceptedValues: Boolean || Description: If true, will generate a user facing panel to open the WebModal when clicked
      CallDisconnect: true              // AcceptedValues: Boolean || Description: If true, the WebModal will open when a call disconnects
    },
    ClearCacheOnExit: {
      Mode: false,                      // AcceptedValues: Boolean || Description: Have the Webview Cache Clear when Closed. Note: this could disrupt other web based services
      Target: 'WebApps'                 // AcceptedValues: 'All', 'Signage', 'WebApps', 'PersistentWebApp' || Description: Choose which Cache to Clear
    }
  },
  UserInterface: {
    Panel: {
      Name: 'WebView on Navigator',     // AcceptedValues: String || Description: Set the Name of the Panel
      Location: 'HomeScreen',           // AcceptedValues: 'HomeScreen', 'HomeScreenAndCallControls', 'CallControls', 'Never', 'ControlPanel' || Description: Set the location of the User Interface
      Order: 1,                         // AcceptedValues: Integer || Set the Position where this panel will render amongst other Custom Panels. Does not effect Native Panels
      Icon: {
        Type: 'Blinds',                 // AcceptedValues: Choose an Option from the list Below. Note, Custom expects a the CustomIconURL to be provided
        /*
        "Blinds", "Briefing", "Camera", "Concierge", 
        "Custom", "Disc", "Handset", "Help", "Helpdesk", 
        "Home", "Hvac", "Info", "Input", "Language", 
        "Laptop", "Lightbulb", "Media", "Microphone", 
        "Power", "Proximity", "Record", "Sliders", "Tv"
        */
        Color: 'cf7900',                // AcceptedValues: String || Set a Background Color using a Hexadecimal Value. Does not apply to Custom Icons or Icons located in the Control Panel
        CustomIconURL: 'https://avatars.githubusercontent.com/u/159071680?s=200&v=4' // AcceptedValues: String || Must be a .ico, .jpg or .png file that's between 60x60px to 1200x1200px in size. If the image fails to download, the icon above will be used
      }
    }
  }
}
```

## FAQ

### Is this Macro Supported by Cisco TAC?
- No, all Macros are considered Custom Code by Cisco and are not supported.