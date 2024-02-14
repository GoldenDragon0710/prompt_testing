import React from "react";
import {
  Tabs,
  TabsHeader,
  TabsBody,
  Tab,
  TabPanel,
} from "@material-tailwind/react";
import { Edit_tab, Test_tab } from "@/widgets/tabs";

export function Home() {
  return (
    <>
      <div className="relative flex h-screen w-full flex-col">
        <div className="container mx-auto h-full w-full px-2 py-5">
          <Tabs value="edit" className="h-full w-full">
            <TabsHeader>
              <Tab value={"edit"}>Edit</Tab>
              <Tab value={"test"}>Test</Tab>
            </TabsHeader>
            <TabsBody className="h-full">
              <TabPanel value={"edit"}>
                <Edit_tab />
              </TabPanel>
              <TabPanel value={"test"} className="h-full">
                <Test_tab />
              </TabPanel>
            </TabsBody>
          </Tabs>
        </div>
      </div>
    </>
  );
}

export default Home;
