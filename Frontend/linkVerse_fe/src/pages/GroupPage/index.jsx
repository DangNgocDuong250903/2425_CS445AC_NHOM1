import { TopBar, Wrapper } from "~/components";

const GroupPage = () => {
  return (
    <Wrapper>
      <div className="w-full bg-bgColor h-screen overflow-hidden">
        <TopBar title={"Group"} />
        <div className="w-full h-full flex justify-center">
          <div className="w-[800px] flex flex-col h-full bg-primary mt-2 rounded-tl-3xl rounded-tr-3xl shadow-newFeed border-x-[0.8px] border-y-[0.8px] border-borderNewFeed overflow-y-auto">
            {/* header */}
            <div className="w-full h-40 p-5"></div>
            {/* body */}
          </div>
        </div>
      </div>
    </Wrapper>
  );
};

export default GroupPage;
