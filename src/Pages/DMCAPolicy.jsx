import React, { useEffect, useState } from "react";
import { firebase } from "../Firebase/config";
import { Container, Row, Col } from "react-bootstrap";
import { Spin, Button, message } from "antd";
import { CKEditor } from "@ckeditor/ckeditor5-react";
// import ClassicEditor from "@ckeditor/ckeditor5-build-classic"
import ClassicExtended from "ckeditor5-build-classic-extended";

const Privacy = () => {
  //state
  const [isLoading, setIsLoading] = useState(true);
  const [dmca, setDmca] = useState(null);
  const [btnLoading, setBtnLoading] = useState(false);

  useEffect(() => {
    firebase
      .firestore()
      .collection("dmcaPolicy")
      .doc("dmca")
      .get()
      .then((doc) => {
        setDmca(doc.data().dmca);
        setIsLoading(false);
      })
      .catch((e) => console.log(e));
  }, []);

  const handleSubmit = (values) => {
    setBtnLoading(true);
    firebase
      .firestore()
      .collection("dmcaPolicy")
      .doc("dmca")
      .set({ dmca }, { merge: true })
      .then((doc) => {
        setBtnLoading(false);
        message.success("DCMA Policy Updated!");
      })
      .catch((e) => console.log(e));
  };

  const handleEditorChange = (event, editor) => {
    const data = editor.getData();
    setDmca(data);
  };

  return (
    <>
      <Container className="mt-4 p-1 p-lg-5" style={{ minHeight: "100vh" }}>
        <Row>
          <Col>
            <h5>DMCA Policy</h5>
          </Col>
        </Row>
        {isLoading ? (
          <Row>
            <Col className="d-flex justify-content-center">
              <Spin size="large" />
            </Col>
          </Row>
        ) : (
          <Row>
            <Col xs={12}>
              {/* <CKEditor
                // editor={ClassicEditor}
                data={dmca}
                onChange={handleEditorChange}
              /> */}
              <CKEditor
                // editor={ClassicEditor}
                data={dmca}
                editor={ClassicExtended}
                 config={{
                  toolbar: [
                    "heading",
                    "alignment",
                    "|",
                    "bold",
                    "italic",
                    "link",
                    "bulletedList",
                    "subscript",
                    "superscript",
                    "numberedList",
                    "List",
                    "ListUI",
                    "BlockQuote",
                    "Undo",
                    "Redo",
                    "Image",
                    "ImageCaption",
                    "ImageStyle",
                    "ImageToolbar",
                    "ImageUpload",
                  ],
                }}
                onChange={handleEditorChange}
              />
            </Col>
            <Col xs={12} className="d-flex justify-content-end mt-3">
              <Button
                type="primary"
                className="btnPrimary w-25"
                htmlType="submit"
                loading={btnLoading}
                onClick={handleSubmit}
              >
                Post
              </Button>
            </Col>
          </Row>
        )}
      </Container>
    </>
  );
};

export default Privacy;
