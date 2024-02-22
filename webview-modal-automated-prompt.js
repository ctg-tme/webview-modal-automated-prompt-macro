/********************************************************
Copyright (c) 2024 Cisco and/or its affiliates.
This software is licensed to you under the terms of the Cisco Sample
Code License, Version 1.1 (the "License"). You may obtain a copy of the
License at
               https://developer.cisco.com/docs/licenses
All use of the material herein must be in accordance with the terms of
the License. All rights not expressly granted by the License are
reserved. Unless required by applicable law or agreed to separately in
writing, software distributed under the License is distributed on an "AS
IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express
or implied.
*********************************************************

 * Author(s):               Robert(Bobby) McGonigle Jr
 *                          Technical Marketing Engineer
 *                          Cisco Systems
 * 
 * Consulting Engineer(s)   Jon Miranda
 *                          Technical Solutions Architect
 *                          Cisco Systems
 * 
 * Description: 
 * - Customize and Open a Webview Display Modal on Button Clicks or Call Disconnects
*/

import xapi from 'xapi';

const config = {
  WebModal: { // Set Values pertaining to a Web Based Modal
    Title: 'Cisco',                     //Set a user facing title for the Web Modal
    Url: 'https://cisco.com',           // Set the URL you want to open
    OSDToolTip: {                       // If the modal is prompted by a trigger without user interaction, this tooltip will show to help guide the user
      Mode: true,
      Message: 'Tell us about your experience on the Touch Panel 🙂',
      Duration: 15,
      Location: 'Top-Right', // Top-Right, Top-Left, Center, Bottom-Right, Bottom-Left
    },
    Triggers: { // Choose how the WebModal should be prompted to open
      PanelClicked: true,               // If true, will generate a user facing panel to open the WebModal when clicked
      CallDisconnect: true              // If true, the WebModal will open when a call disonnects
    },
    ClearCacheOnExit: {
      Mode: false,
      Target: 'WebApps'                 // All, Signage, WebApps, PersistentWebApp
    }
  },
  UserInterface: {
    Panel: {
      Name: 'WebView on Navigator',     // Set the Name of the Panel
      Location: 'HomeScreen',           // HomeScreen, HomeScreenAndCallControls, CallControls, Never, ControlPanel
      Order: 1,                         // Set the Position where this panel will render amongst other Custom Panels. Does not effect Native Panels
      Icon: {
        Type: 'Blinds',                 // Choose an Option from the list Below. Note, Custom expect a the CustomIconURL to be provided
        /*
        "Blinds", "Briefing", "Camera", "Concierge", 
        "Custom", "Disc", "Handset", "Help", "Helpdesk", 
        "Home", "Hvac", "Info", "Input", "Language", 
        "Laptop", "Lightbulb", "Media", "Microphone", 
        "Power", "Proximity", "Record", "Sliders", "Tv"
        */
        Color: 'cf7900',                // Set a Background Color using a Hexadecimal Value. Does not apply to Custom Icons or Icons located in the Control Panel
        CustomIconURL: 'https://avatars.githubusercontent.com/u/159071680?s=200&v=4' // Must be a .ico, .jpg or .png file that's between 60x60px to 1200x1200px in size. If the image fails to download, the icon above will be used
      }
    }
  }
}

const panelId = 'webModal';

async function buildUserInterface() {
  const xml = `<Extensions>
                <Panel>
                  <Order>${config.UserInterface.Panel.Order}</Order>
                  <Location>${config.UserInterface.Panel.Location}</Location>
                  <Icon>${config.UserInterface.Panel.Icon.Type.toLowerCase() == 'custom' ? 'Blinds' : config.UserInterface.Panel.Icon.Type}</Icon>
                  <Name>${config.UserInterface.Panel.Name}</Name>
                  <ActivityType>Custom</ActivityType>
                </Panel>
              </Extensions>`

  console.info({ Info: 'Buiding UserInterface...', Properties: config.UserInterface.Panel })

  if (config.WebModal.Triggers.PanelClicked) {
    await xapi.Command.UserInterface.Extensions.Panel.Save({ PanelId: panelId }, xml)
    if (config.UserInterface.Panel.Icon.Type.toLowerCase() == 'custom' && config.UserInterface.Panel.Icon.CustomIconURL != '') {
      try {
        let getIconAndId = (await xapi.Command.UserInterface.Extensions.Icon.Download({ Url: config.UserInterface.Panel.Icon.CustomIconURL })).IconId
        console.info({ Info: `Custom Icon fetched, ID: ${getIconAndId}` })
        let uploadIcon = await xapi.Command.UserInterface.Extensions.Panel.Update({ IconId: getIconAndId, Icon: 'Custom', PanelId: panelId });
        console.info({ Info: `Custom Icon Uploaded!` })
      } catch (e) {
        console.error(e)
      }
    }
    console.info({ Info: 'UserInterface Built!' })
  } else {
    await xapi.Command.UserInterface.Extensions.Panel.Remove({ PanelId: panelId })
    console.info({ Info: 'UserInterface Removed! PanelClicked Trigger Not Enabled.' })
  }
}

let modalLocation = 'Controller';

const handle = {
  PanelClicked: async function (event) {
    if (event.PanelId == panelId) {
      try {
        await xapi.Command.UserInterface.WebView.Display({ Title: `${config.WebModal.Title}`, Url: config.WebModal.Url, Target: modalLocation, Mode: 'Modal' })
        console.log({ Message: `WebModal Opened [${config.WebModal.Title}] via Panel Clicked Event on [${modalLocation}]` })
      } catch (e) {
        e.Context = 'Failed to open Webview Display on Panel Clicked'
        console.error(e)
      }
    }
  },
  CallDisconnect: async function (event) {
    if (config.WebModal.OSDToolTip.Mode && modalLocation == 'Controller') {
      let x = 1000;
      let y = 1000;
      switch (config.WebModal.OSDToolTip.Location) {
        case 'Top-Right':
          x = 9000;
          break;
        case 'Center':
          x = 5000; y = 5000;
          break;
        case 'Bottom-Left':
          y = 9000;
          break;
        case 'Bottom-Right':
          x = 9000; y = 9000;
          break;
      }
      xapi.Command.UserInterface.Message.TextLine.Display({ Text: config.WebModal.OSDToolTip.Message, Duration: config.WebModal.OSDToolTip.Duration, X: x, Y: y })
    }
    try {
      await xapi.Command.UserInterface.WebView.Display({ Title: `${config.WebModal.Title}`, Url: config.WebModal.Url, Target: modalLocation, Mode: 'Modal' })
      console.log({ Message: `WebModal Opened [${config.WebModal.Title}] via Call Disconnect Event on [${modalLocation}]` })
    } catch (e) {
      e.Context = 'Failed to open Webview Display on Call Disonnect'
      console.error(e)
    }
  },
  WebViewClear: async function (event) {
    if (event?.Status && event.Status == 'NotVisible') {
      try {
        await xapi.Command.WebEngine.DeleteStorage({ Type: config.WebModal.ClearCacheOnExit.Target })
        console.warn({ Warning: `Webview Storage Deleted, Type: [${config.WebModal.ClearCacheOnExit.Target}]` })
      } catch (e) {
        e.Context = 'Failed to delete Storage on Webview Clear'
        console.error(e)
      }
    }
  }
}

async function init() {
  console.log({ Info: 'Initializing Macro...' })

  const product = await xapi.Status.SystemUnit.ProductPlatform.get()

  const peripherals = await xapi.Status.Peripherals.ConnectedDevice.get()

  let cause = ''

  if (product.includes('Desk') || product.includes('Board')) {
    modalLocation = 'OSD'
    cause = 'Touch enabled product found without a controller connected'
  }

  peripherals.forEach(element => {
    if (element.Name.includes('Navigator') && element.Location == 'InsideRoom') {
      modalLocation = 'Controller'
      cause = 'Controller connected inside the room'
    }
  })

  console.info({ Info: `Product Identified [${product}], the WebModal with render on the [${modalLocation}]`, Cause: cause })

  await buildUserInterface()

  if (config.WebModal.Triggers.PanelClicked) {
    xapi.Event.UserInterface.Extensions.Panel.Clicked.on(handle.PanelClicked)
    console.info({ Info: 'Subscribed to Panel Clicked Event' })
  }

  if (config.WebModal.Triggers.CallDisconnect) {
    xapi.Event.CallDisconnect.on(handle.CallDisconnect)
    console.info({ Info: 'Subscribed to Call Disconnect Event' })
  }

  if (config.WebModal.ClearCacheOnExit.Mode) {
    console.warn({ Warning: `ClearCacheOnExit is enabled, this may interfere with Web Based Solutions on the device outside this macro. Consider Disabling` })
    xapi.Status.UserInterface.WebView['*'].on(handle.WebViewClear)
    console.info({ Info: 'Subscribed to Webview Cleared Event' })
  }

  console.log({ Info: 'Macro Initialized!' })
}

init()