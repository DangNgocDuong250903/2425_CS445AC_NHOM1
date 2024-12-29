import Backdrop from "@mui/material/Backdrop";
import LinearProgress from "@mui/material/LinearProgress";
import { useEffect, useState } from "react";

export default function PreviewStory({ open, handleClose, story }) {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    if (!open) {
      setProgress(0);
      return;
    }

    const totalDuration = 10000;
    const intervalTime = 100;

    const updateProgress = () => {
      setProgress((prev) => {
        const nextProgress = prev + 100 / (totalDuration / intervalTime);
        if (nextProgress >= 100) {
          clearInterval(interval);
          handleClose();
          return 100;
        }
        return nextProgress;
      });
    };

    const interval = setInterval(updateProgress, intervalTime);

    return () => clearInterval(interval);
  }, [open, handleClose]);

  return (
    <Backdrop
      sx={(theme) => ({
        color: "#fff",
        zIndex: theme.zIndex.drawer + 1,
        padding: "50px",
      })}
      open={open}
      onClick={handleClose}
    >
      <div className="h-full w-[350px] rounded-3xl relative">
        <LinearProgress
          variant="determinate"
          value={progress}
          color="inherit"
          sx={{
            position: "absolute",
            top: 15,
            left: "50%",
            transform: "translateX(-50%)",
            width: "90%",
            height: "4px",
            borderRadius: "20px",
            zIndex: 1,
          }}
        />

        <div className="flex flex-col items-center justify-center absolute inset-0">
          {story?.imageUrl && story?.imageUrl.length > 0 ? (
            <img
              src={story?.imageUrl}
              alt=""
              style={{
                objectFit: "cover",
                width: "100%",
                height: "100%",
                borderRadius: "1rem",
              }}
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center rounded-3xl  bg-pink-200">
              <span className="text-red-600">{story?.content}</span>
            </div>
          )}
        </div>
      </div>
    </Backdrop>
  );
}
