import React, { useState, useEffect, useRef } from "react";
import {
  Input,
  Button,
  Avatar,
  Typography,
  Dialog,
  DialogHeader,
  DialogBody,
  Textarea,
} from "@material-tailwind/react";
import { fetchEventSource } from "@microsoft/fetch-event-source";
import { MyLoader } from "@/widgets/loader/MyLoader";
import { notification } from "antd";

export function Test_tab() {
  let stream_res = "";
  const [msglist, setMsglist] = useState([]);
  const [loading, setloading] = useState(false);
  const [sysPrompt, setSysPrompt] = useState("You are an AI assistant");
  const [initPrompt, setInitPrompt] = useState("You are an AI assistant");
  const [prompt, setPrompt] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [response, setResponse] = useState("");
  const chatWindowRef = useRef(null);

  useEffect(() => {
    if (msglist.length != 0) {
      const chatWindow = chatWindowRef.current;
      chatWindow.scrollTop = chatWindow.scrollHeight;
    }
  }, [msglist]);

  const handleSubmit = () => {
    const item = {
      role: "user",
      content: prompt,
    };
    let list = [...msglist];
    list.push(item);
    setMsglist(list);
    const ctrl = new AbortController();
    async function fetchAnswer() {
      setloading(true);
      try {
        await fetchEventSource(`${process.env.REACT_APP_BASED_URL}/chat`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            list: list,
            sysPrompt: sysPrompt,
          }),
          signal: ctrl.signal,
          onmessage: (event) => {
            setloading(false);
            if (JSON.parse(event.data).data === "[DONE]") {
              setPrompt("");
              setResponse("");
              updateMsgList(stream_res);
              ctrl.abort();
            } else {
              stream_res += JSON.parse(event.data).data;
              setResponse((response) => response + JSON.parse(event.data).data);
            }
          },
        });
      } catch (err) {
        setloading(false);
        notification.warning({ message: "Internal Server Error" });
      }
    }
    fetchAnswer();
  };

  const updateMsgList = (answer) => {
    let list = [...msglist];
    list.push({
      role: "user",
      content: prompt,
    });
    list.push({
      role: "assistant",
      content: answer,
    });
    setMsglist(list);
  };

  const handleOpen = () => {
    setIsOpen(!isOpen);
  };

  const handleSave = () => {
    setSysPrompt(initPrompt);
    setIsOpen(!isOpen);
  };

  const handleKeyDown = (event) => {
    if (event.key == "Enter") {
      handleSubmit();
    }
  };

  return (
    <>
      <div className="test-tab relative flex h-full w-full flex-col">
        {loading && <MyLoader isloading={loading} />}
        <div className="container mx-auto flex h-full w-full flex-col justify-between px-2 py-5">
          <div
            className="flex h-full w-full flex-col overflow-y-auto"
            ref={chatWindowRef}
          >
            {msglist &&
              msglist.map((item, idx) => {
                return (
                  <div key={idx} className="my-2 flex w-full">
                    {item.role == "user" && (
                      <Avatar src="img/user.svg" className="h-5 w-auto" />
                    )}
                    {item.role == "assistant" && (
                      <Avatar src="img/bot.svg" className="h-5 w-auto" />
                    )}
                    <div
                      dangerouslySetInnerHTML={{
                        __html: item.content.includes("\n")
                          ? item.content.replace(/\n/g, "<br />")
                          : item.content,
                      }}
                      className="ml-2 text-base"
                    />
                  </div>
                );
              })}
            {response != "" && (
              <div className="my-2 flex w-full">
                <Avatar src="img/bot.svg" className="h-5 w-auto" />
                <div
                  dangerouslySetInnerHTML={{
                    __html: response.includes("\n")
                      ? response.replace(/\n/g, "<br />")
                      : response,
                  }}
                  className="ml-2 text-base"
                />
              </div>
            )}
          </div>
          <div className="relative mb-5 mt-2 flex w-full">
            <div className="relative flex w-full">
              <Input
                onChange={(e) => setPrompt(e.target.value)}
                value={prompt}
                onKeyDown={handleKeyDown}
                className="w-full rounded-full px-5 text-base"
                placeholder="Ask anything..."
                labelProps={{
                  className: "before:content-none after:content-none",
                }}
              ></Input>
              <div className="absolute right-0 mx-2 flex h-full items-center">
                <Button
                  onClick={handleSubmit}
                  variant="text"
                  className="rounded-full p-2 shadow-none hover:shadow-none"
                >
                  <Avatar src="/img/send.svg" className="h-auto w-5" />
                </Button>
              </div>
            </div>
            <div className="ml-2 flex h-full items-center">
              <Button
                onClick={(e) => setIsOpen(true)}
                variant="text"
                className="p-0"
              >
                <Avatar src="/img/setting.svg" className="h-8 w-8" />
              </Button>
            </div>
          </div>
        </div>
      </div>
      <Dialog open={isOpen} handler={handleOpen}>
        <DialogHeader>
          <Typography variant="h3">Context</Typography>
        </DialogHeader>
        <DialogBody>
          <Textarea
            onChange={(e) => setInitPrompt(e.target.value)}
            className="w-full text-base"
            value={initPrompt}
            labelProps={{
              className: "before:content-none after:content-none",
            }}
          />
          <div className="flex w-full justify-between">
            <Button onClick={handleOpen}>Cancel</Button>
            <Button onClick={handleSave}>Save</Button>
          </div>
        </DialogBody>
      </Dialog>
    </>
  );
}

export default Test_tab;
