import React, { useEffect, useState } from "react";
import { firebase } from "../Firebase/config";
import { Container, Row, Col } from "react-bootstrap";
import { Spin, Button, message } from "antd";
import { CKEditor } from "@ckeditor/ckeditor5-react";
import ClassicExtended from "ckeditor5-build-classic-extended";

const Privacy = () => {
  //state
  const [isLoading, setIsLoading] = useState(true);
  const [affiliate, setAffiliate] = useState(null);
  const [btnLoading, setBtnLoading] = useState(false);

  useEffect(() => {
    firebase
      .firestore()
      .collection("affiliateDisclosure")
      .doc("affiliate")
      .get()
      .then((doc) => {
        setAffiliate(doc.data().affiliate);
        setIsLoading(false);
      })
      .catch((e) => console.log(e));
  }, []);

  const handleSubmit = (values) => {
    setBtnLoading(true);
    firebase
      .firestore()
      .collection("affiliateDisclosure")
      .doc("affiliate")
      .set({ affiliate }, { merge: true })
      .then((doc) => {
        setBtnLoading(false);
        message.success("Affiliate Disclosure Updated!");
      })
      .catch((e) => console.log(e));
  };

  const handleEditorChange = (event, editor) => {
    const data = editor.getData();
    setAffiliate(data);
  };

  return (
    <>
      <Container className="mt-4 p-1 p-lg-5" style={{ minHeight: "100vh" }}>
        <Row>
          <Col>
            <h5>Affiliate Disclosure </h5>
            <CKEditor
              // editor={ClassicEditor}
              data={affiliate}
              editor={ClassicExtended}
              config={{
                toolbar: [
                  "heading",
                  "alignment",
                  "|",
                  "numberedList",

                  "fontFamily",
                  "undo",
                  "redo",
                  "fontSize",
                  "fontColor",
                  "fontBackgroundColor",
                  "bold",
                  "underline",
                  "strikethrough",
                  "italic",
                  "link",
                  "bulletedList",
                  "subscript",
                  "superscript",
                  "Image",
                  "ImageCaption",
                  "ImageStyle",
                  "ImageToolbar",
                  "ImageUpload",
                  "ImageResizeHandles",
                  "ImageResizeEditing",
                  "ImageResize",
                ],
              }}
              onChange={handleEditorChange}
            />
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
