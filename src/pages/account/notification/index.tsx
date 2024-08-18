import Breadcumb from "@/components/breadcumb";
import { BreadcumbTitle } from "@/components/constants";
import UserSideMenu from "@/components/userSideMenu";
import { Base } from "@/templates/Base";
import { Divider } from "@material-ui/core";

const UserNotificationPage = () => {
  return (
    <Base>
      <div className="mx-w-full p-6 sm:py-6 lg:px-8 relative z-1">
        <Breadcumb mainRoot={BreadcumbTitle.account || ''} subRoot="Thông báo" />
        <article className="flex mt-4">
          <div className="flex-initial w-1/4">
            <UserSideMenu />
          </div>
          <Divider orientation="vertical" flexItem />
          <div className="flex-initial w-3/4 pl-4 pt-5">
            <label>...</label>
          </div>
        </article>
      </div>
    </Base>
  );
};

export default UserNotificationPage;