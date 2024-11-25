import { TextInput, TopBar, Wrapper } from "~/components";

const GroupPage = () => {
  return (
    <Wrapper>
      <div className="w-full bg-bgColor h-screen overflow-hidden">
        <TopBar title={"Group"} />
        <div className="w-full h-full flex justify-center">
          <div className="w-[800px] lef flex flex-col h-full bg-primary mt-2 rounded-tl-3xl rounded-tr-3xl shadow-newFeed border-x-[0.8px] border-y-[0.8px] border-borderNewFeed overflow-y-auto">
            <TextInput iconRight="bg-[url('https://static.thenounproject.com/png/101791-200.png')] bg-right bg-no-repeat bg-[length:20px_20px]" />
          </div>
        </div>
      </div>
    </Wrapper>
  );
};

export default GroupPage;
