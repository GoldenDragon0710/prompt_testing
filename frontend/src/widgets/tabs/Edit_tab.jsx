import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  Input,
  Button,
  Typography,
  Dialog,
  DialogHeader,
  DialogBody,
  Textarea,
  Menu,
  MenuHandler,
  MenuList,
  MenuItem,
  Avatar,
} from "@material-tailwind/react";
import { notification } from "antd";
import { MyLoader } from "@/widgets/loader/MyLoader";

export function Edit_tab() {
  let original_prompt = "";
  const [loading, setloading] = useState(false);
  const [newProject, setNewProject] = useState("");
  const [newPrompt, setNewPrompt] = useState("");
  const [projectlist, setProjectList] = useState([]);
  const [isDisable, setIsDisable] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [currentProjectIdx, setCurrentProjectIdx] = useState(0);

  useEffect(() => {
    getAllProjects();
  }, []);

  const getAllProjects = async () => {
    try {
      setloading(true);
      const response = await axios.get(
        `${process.env.REACT_APP_BASED_URL}/prompt`
      );
      const list = response.data.data.map((item) => ({
        id: item.id,
        name: item.name,
        prompt: item.prompt,
      }));
      setProjectList(list);
    } catch (err) {
      notification.warning({ message: "Internal Server Error" });
    } finally {
      setloading(false);
    }
  };

  const handleSelectProject = (idx) => {
    original_prompt = projectlist[idx].prompt;
    setCurrentProjectIdx(idx);
  };

  const handleSave = async () => {
    try {
      setloading(true);
      const response = await axios.post(
        `${process.env.REACT_APP_BASED_URL}/prompt/update`,
        {
          id: projectlist[currentProjectIdx].id,
          prompt: projectlist[currentProjectIdx].prompt,
        }
      );
      const list = response.data.data.map((item) => ({
        id: item.id,
        name: item.name,
        prompt: item.prompt,
      }));
      setProjectList(list);
    } catch (err) {
      notification.warning({ message: "Internal Server Error" });
    } finally {
      setloading(false);
    }
    setIsDisable(false);
  };

  const handleCancel = () => {
    setIsDisable(false);
    let list = [...projectlist];
    list[currentProjectIdx].prompt = original_prompt;
    setProjectList[list];
  };

  const handleAddable = () => {
    setIsOpen(true);
  };

  const handleOpen = () => {
    setIsOpen(!isOpen);
    setNewProject("");
    setNewPrompt("");
  };

  const createNewPrompt = async () => {
    setIsOpen(!isOpen);
    if (newPrompt == "") {
      notification.warning({ message: "Please enter the prompt" });
      return;
    }
    if (newProject == "") {
      notification.warning({ message: "Please enter the project name" });
      return;
    }
    try {
      setloading(true);
      const response = await axios.post(
        `${process.env.REACT_APP_BASED_URL}/prompt`,
        {
          name: newProject,
          prompt: newPrompt,
        }
      );
      const list = response.data.data.map((item) => ({
        id: item.id,
        name: item.name,
        prompt: item.prompt,
      }));
      setProjectList(list);
      notification.success({ message: "Created successfully" });
    } catch (err) {
      notification.warning({ message: "Internal Server Error" });
    } finally {
      setloading(false);
    }
  };

  const handleDelete = async () => {
    if (currentProjectIdx == null) {
      notification.warning({ message: "Please select a project" });
      return;
    }
    try {
      setloading(true);
      const response = await axios.post(
        `${process.env.REACT_APP_BASED_URL}/prompt/delete`,
        {
          id: projectlist[currentProjectIdx].id,
        }
      );
      const list = response.data.data.map((item) => ({
        id: item.id,
        name: item.name,
        prompt: item.prompt,
      }));
      setProjectList(list);
      notification.success({ message: "Deleted successfully" });
    } catch (err) {
      notification.warning({ message: "Internal Server Error" });
    } finally {
      setloading(false);
    }
  };

  return (
    <>
      <div className="edit-tab relative flex h-full w-full flex-col">
        {loading && <MyLoader isloading={loading} />}
        <div className="container mx-auto flex h-full w-full flex-col justify-between px-2 py-5">
          <div className="mx-auto flex w-1/3">
            <Menu>
              <MenuHandler>
                <Button
                  variant="outlined"
                  className="mx-auto w-full max-w-[300px]"
                >
                  {projectlist.length > 0
                    ? projectlist[currentProjectIdx].name
                    : "Create a new project"}
                </Button>
              </MenuHandler>
              <MenuList>
                {projectlist.length > 0 &&
                  projectlist.map((item, idx) => {
                    return (
                      <MenuItem key={idx}>
                        <Typography onClick={() => handleSelectProject(idx)}>
                          {item.name}
                        </Typography>
                      </MenuItem>
                    );
                  })}
              </MenuList>
            </Menu>
            <Button
              onClick={handleAddable}
              variant="text"
              className="mx-2 w-12 p-0 normal-case"
            >
              <Avatar src="img/plus.svg" className="h-auto w-5"></Avatar>
            </Button>
          </div>
          <div className="mt-2 py-5">
            <div className="flex w-full items-center">
              <Typography className="mx-2 w-16 text-base font-medium">
                Name
              </Typography>
              <Input
                value={
                  projectlist.length != 0
                    ? projectlist[currentProjectIdx].name
                    : ""
                }
                className="w-full rounded px-5 text-base"
                placeholder="Project name..."
                disabled
              />
            </div>
            <div className="mt-5 flex w-full">
              <Typography className="mx-2 mt-2 w-16 text-base font-medium">
                Prompt
              </Typography>
              <Textarea
                rows={20}
                onChange={(e) => {
                  let list = [...projectlist];
                  if (list[currentProjectIdx].name != "") {
                    setIsDisable(true);
                  }
                  list[currentProjectIdx].prompt = e.target.value;
                  setProjectList(list);
                }}
                value={
                  projectlist.length != 0
                    ? projectlist[currentProjectIdx].prompt
                    : ""
                }
                label="Prompt"
                className="w-full rounded px-5 text-base"
              />
            </div>
          </div>
          <div className="mx-auto mt-2 flex w-3/5 justify-between">
            <Button
              className="w-32"
              onClick={handleCancel}
              disabled={!isDisable}
            >
              Cancel
            </Button>
            <Button className="w-32" onClick={handleSave} disabled={!isDisable}>
              Save
            </Button>
            <Button className="w-32" onClick={handleDelete}>
              Delete
            </Button>
          </div>
        </div>
        <Dialog open={isOpen} handler={handleOpen}>
          <DialogHeader>
            <Typography variant="h3">New Project</Typography>
          </DialogHeader>
          <DialogBody>
            <div className="my-4 w-full">
              <Input
                onChange={(e) => setNewProject(e.target.value)}
                className="text-base"
                label="Project Name"
              />
            </div>
            <div className="my-4 w-full">
              <Textarea
                rows={10}
                onChange={(e) => setNewPrompt(e.target.value)}
                className="text-base"
                label="Prompt"
              />
            </div>
            <div className="flex w-full justify-between">
              <Button onClick={handleOpen}>Cancel</Button>
              <Button onClick={createNewPrompt}>Create</Button>
            </div>
          </DialogBody>
        </Dialog>
      </div>
    </>
  );
}

export default Edit_tab;
