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
  Select,
  Option,
} from "@material-tailwind/react";
import { notification } from "antd";
import { MyLoader } from "@/widgets/loader/MyLoader";

export function Edit_tab() {
  const [loading, setloading] = useState(false);
  const [currentPrompt, setCurrentPrompt] = useState("");
  const [newProject, setNewProject] = useState("");
  const [newPrompt, setNewPrompt] = useState("");
  const [projectlist, setProjectList] = useState([]);
  const [isDisable, setIsDisable] = useState(false);
  const [updatedPrompt, setUpdatedPrompt] = useState("");
  const [name, setName] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [currentProjectIdx, setCurrentProjectIdx] = useState(0);

  useEffect(() => {
    getAllProjects();
  }, []);

  const getAllProjects = () => {
    setloading(true);
    axios
      .get(`${process.env.REACT_APP_BASED_URL}/prompt`)
      .then((res) => {
        let list = [];
        res.data.data.map((item) => {
          let data = {
            id: item.id,
            name: item.name,
            prompt: item.prompt,
          };
          list.push(data);
        });
        setProjectList(list);
        setloading(false);
      })
      .catch((err) => {
        setloading(false);
        notification.warning({ message: "Internal Server Error" });
      });
  };

  const handleSelectProject = (name) => {
    if (projectlist) {
      projectlist.map((item, idx) => {
        if (item.name === name) {
          setUpdatedPrompt(projectlist[idx].prompt);
          setName(name);
          setCurrentProjectIdx(idx);
        }
      });
    }
  };

  const handleSave = () => {
    setCurrentPrompt(updatedPrompt);
    const data = {
      id: projectlist[currentProjectIdx].id,
      prompt: updatedPrompt,
    };
    setloading(true);
    axios
      .post(`${process.env.REACT_APP_BASED_URL}/prompt/update`, data)
      .then((res) => {
        let list = [];
        res.data.data.map((item) => {
          let data = {
            id: item.id,
            name: item.name,
            prompt: item.prompt,
          };
          list.push(data);
        });
        setProjectList(list);
        setloading(false);
        notification.success({ message: "Updated successfully" });
      })
      .catch((err) => {
        setloading(false);
        notification.warning({ message: "Internal Server Error" });
      });
    setIsDisable(false);
  };

  const handleCancel = () => {
    setIsDisable(false);
    setUpdatedPrompt(currentPrompt);
  };

  const handleAddable = () => {
    setIsOpen(true);
  };

  const handleOpen = () => {
    setIsOpen(!isOpen);
    setNewProject("");
    setNewPrompt("");
  };

  const createNewPrompt = () => {
    setIsOpen(!isOpen);
    if (newPrompt == "") {
      notification.warning({ message: "Please enter the prompt." });
      return;
    }
    if (newProject == "") {
      notification.warning({ message: "Please enter the project name." });
      return;
    }
    const data = {
      name: newProject,
      prompt: newPrompt,
    };
    setloading(true);
    axios
      .post(`${process.env.REACT_APP_BASED_URL}/prompt`, data)
      .then((res) => {
        let list = [];
        res.data.data.map((item) => {
          let data = {
            id: item.id,
            name: item.name,
            prompt: item.prompt,
          };
          list.push(data);
        });
        setProjectList(list);
        setloading(false);
        notification.success({
          message: "Created successfully",
        });
      })
      .catch((err) => {
        setloading(false);
        console.log(err);
        notification.warning({ message: "Internal Server Error" });
      });
  };

  return (
    <>
      <div className="edit-tab relative flex h-full w-full flex-col">
        {loading && <MyLoader isloading={loading} />}
        <div className="container mx-auto flex h-full w-full flex-col justify-between px-2 py-5">
          <div className="mx-auto flex w-1/2">
            <Select label="Select a project" onChange={handleSelectProject}>
              {projectlist &&
                projectlist.map((item, idx) => {
                  return (
                    <Option key={idx} value={item.name}>
                      {item.name}
                    </Option>
                  );
                })}
            </Select>
            <Button onClick={handleAddable} className="mx-2 w-20 normal-case">
              Add
            </Button>
          </div>
          <div className="mt-2 py-5">
            <div className="flex w-full items-center">
              <Typography className="mx-2 w-16 text-base font-medium">
                Name
              </Typography>
              <Input
                value={name}
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
                  setUpdatedPrompt(e.target.value);
                  if (name != "") {
                    setIsDisable(true);
                  }
                }}
                value={updatedPrompt}
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
