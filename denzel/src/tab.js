import React from 'react'
import { Tabs, Tab, Panel } from '@bumaga/tabs' 

export default () => (
  <Tabs>
    <div>
      <Tab><button>Tab 1</button></Tab>
      <Tab><button>Tab 2</button></Tab>
      <Tab><button>Tab 3</button></Tab>
    </div>

    <Panel><p>Panel 1</p></Panel>
    <Panel><p>Panel 2</p></Panel>
    <Panel><p>panel 3</p></Panel>
  </Tabs>
);