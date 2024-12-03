import { TopBar } from "~/components";

const GroupPage = () => {
  return (
    <div className="w-full lg:px-10 pb-10 2xl:px-50 bg-bgColor h-screen overflow-hidden">
      <TopBar title={"Group"} />
      <div className="w-full h-full flex justify-center">
        <div className="w-[800px] lef flex flex-col h-full bg-primary mt-2 rounded-tl-3xl rounded-tr-3xl shadow-newFeed border-x-[0.8px] border-y-[0.8px] border-borderNewFeed overflow-y-auto"></div>
      </div>
    </div>
  );
};

export default GroupPage;
