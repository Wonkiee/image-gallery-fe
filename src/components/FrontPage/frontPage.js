import React from 'react';
import { Form, InputGroup, Button } from 'react-bootstrap'
import { orderBy } from 'lodash';
import { getAllImages, saveSelectedImages, getImageByUserId, updateSelectedImages } from '../../services/imageService';
import helpers from '../../utils/helpers';
import constants from '../../utils/constants';
import './frontPage.scss';
const maximumImageCountOnGrid = constants.IMAGE_GRID_PROPS.MAX_IMAGE_COUNT_ON_GRID;

export default class FrontPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      imageList: [],
      allImagesList: [],
      selectedImageCount: 0,
      checkBoxStatusMap: {},
      disableCheckBoxes: false,
      imageOrder: [],
      onGridPage: false,
      showResetButton: false,
    };
    this.onCheck = this.onCheck.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
    this.resetState = this.resetState.bind(this);
  }

  componentDidMount() {
    getImageByUserId().then(response => {
      this.setState({ imageList: response.data });
      this.setState({ onGridPage: true });
      this.setState({ showResetButton: true });
    })
    .catch((err) => {
      getAllImages()
      .then(resp => {
        this.setState({ imageList: resp.data });
        this.setState({ allImagesList: resp.data });
      })
    });
  }

  resetState = (imageList, onGridPage, showResetButton) => {
    this.setState({
      imageList: imageList,
      selectedImageCount: 0,
      disableCheckBoxes: false,
      onGridPage: onGridPage,
      showResetButton: showResetButton
    });
  }

  onCheck = (event) => {
    const checkboxId = event.target.id;
    const checkedStatus = event.target.checked;
    const checkBoxStatusMap = this.state.checkBoxStatusMap;
    const imageOrder = this.state.imageOrder;
    checkBoxStatusMap[checkboxId] = checkedStatus;

    const selectedImagesCount = checkedStatus ? this.state.selectedImageCount + 1 :
      this.state.selectedImageCount - 1;
    checkedStatus ? imageOrder.push(checkboxId) : imageOrder.splice(imageOrder.indexOf(checkboxId, 1));
    this.setState({ selectedImageCount: selectedImagesCount });
    this.setState({ checkBoxStatusMap: checkBoxStatusMap });
    this.setState({ disableCheckBoxes: selectedImagesCount >= maximumImageCountOnGrid });
    this.setState({ imageOrder: imageOrder });
  }

  onSubmit = () => {
    const payload = helpers.getRequestPayloadForImageSave(
      this.state.checkBoxStatusMap,
      this.state.imageList,
      this.state.imageOrder
    );
    if (this.state.imageUpdate) {
      return updateSelectedImages("testUser1", payload)
      .then(res => {
        getImageByUserId().then(resp => {
          const selectedImages = resp.data;
          orderBy(selectedImages, 'order');
          this.resetState(selectedImages, true, true);
        })
      });
    }
    return saveSelectedImages(payload).then(res => {
      const selectedImages = res.data;
      orderBy(selectedImages.images, 'order');
      this.resetState(selectedImages.images, true, true);
    });
  }

  onReset = () => {
    const allImages = this.state.allImagesList;
    if (!allImages || !allImages.length) {
      return getAllImages()
      .then(resp => {
        this.setState({ allImagesList: resp.data });
        this.setState({ imageUpdate: true });
        this.resetState(resp.data, false, true);
      })
    }
    this.setState({ imageUpdate: true });
    return this.resetState(this.state.allImagesList, false, false, true);
  }

  render() {
    const title = !this.state.onGridPage ? `Select Images From the Grid. Maximum of ${maximumImageCountOnGrid} images can be selected`
      : "Image Gallery";
    const subTitle = !this.state.onGridPage ? "images will be ordered in the way you select it by ticking the checkbox" : "";
    return (
      this.state.imageList && this.state.imageList.length ?
        <div>
          <div>
            <Form className="formProperties">
              <h3>{title}</h3>
              <h4>{subTitle}</h4>
              <Button variant="primary" onClick={this.onSubmit} disabled={!this.state.selectedImageCount}> Continue </Button>{' '}
              <Button variant="primary" onClick={this.onReset} disabled={!this.state.showResetButton}> Reset Selection </Button>{' '}
            </Form>
          </div>
            <div className="row">
                <div className="col-md">
                    <div className="row no-gutters">
                    {this.state.imageList.map((val, k) => {
                        return (
                        val && <div className="col-sm-3 columnProperties" key={k}>
                            <img src={val.picture} className="imageProperties"/>
                            <InputGroup.Prepend>
                              <InputGroup.Checkbox
                                onChange={this.onCheck}
                                id={val.id}
                                disabled={ !this.state.checkBoxStatusMap[val.id] && this.state.disableCheckBoxes }
                                hidden={this.state.onGridPage}
                              />
                            </InputGroup.Prepend>
                        </div>)
                        })
                    }
                     </div>
                </div>
            </div>
        </div>
        : <div>Loading...</div>
    )
  }
}
