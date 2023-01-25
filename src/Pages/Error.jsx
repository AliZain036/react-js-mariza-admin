import { useHistory } from "react-router-dom";
import { Button } from "antd";

const Error = () => {
  const history = useHistory();

  return (
    <div className="mt-5 d-flex justify-content-center flex-column align-items-center">
      <div
        style={{ borderRadius: 4 }}
        className="border border-danger d-flex justify-content-center align-items-center flex-column p-4 bg-white"
      >
        <h4>404: Page not found!</h4>
        <Button
          type="primary"
          danger
          onClick={() => history.push("/statistics")}
          className="mt-3"
        >
          Go Back
        </Button>
      </div>
    </div>
  );
};

export default Error;
