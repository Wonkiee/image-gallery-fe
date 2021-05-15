import React from 'react';
import { Form, InputGroup, Button } from 'react-bootstrap'
import { orderBy } from 'lodash';
import { getAllImages, saveSelectedImages, getImageByUserId } from '../../services/imageService';
import helpers from '../../utils/helpers';
import constants from '../../utils/constants';
import './frontPage.scss';
const maximumImageCountOnGrid = constants.IMAGE_GRID_PROPS.MAX_IMAGE_COUNT_ON_GRID;

export default class FrontPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      imageList: [],
      selectedImageCount: 0,
      checkBoxStatusMap: {},
      disableCheckBoxes: false,
      imageOrder: [],
      checkBoxesHidden: false,
      userExists: false,
    };
    this.onCheck = this.onCheck.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
    this.resetState = this.resetState.bind(this);
  }

  componentDidMount() {
    getImageByUserId().then(response => {
      this.setState({ imageList: response.data });
      this.setState({ userExists: true });
    })
    .catch((err) => {
      getAllImages()
      .then(resp => {
        this.setState({ imageList: resp.data });
      })
    });
  }

  resetState = (imageList, checkBoxesHidden, userExists) => {
    this.setState({
      imageList: imageList,
      selectedImageCount: 0,
      imageOrderNumber: 0,
      checkBoxStatusMap: {},
      disableCheckBoxes: false,
      checkBoxesHidden: checkBoxesHidden,
      userExists: userExists
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
    saveSelectedImages(helpers.getRequestPayloadForImageSave(
      this.state.checkBoxStatusMap,
      this.state.imageList,
      this.state.imageOrder
    )).then(res => {
      const selectedImages = res.data;
      orderBy(selectedImages.images, 'order');
      this.resetState(selectedImages.images, true, true);
    });
  }

  render() {
    const title = !this.state.userExists ? `Select Images From the Grid. Maximum of ${maximumImageCountOnGrid} images can be selected`
      : "Image Gallery";
    return (
      this.state.imageList.length ?
        <div>
          <div>
            <Form className="formProperties">
              <h3>{title}</h3>
              <Button variant="primary" onClick={this.onSubmit} disabled={!this.state.selectedImageCount}> Continue </Button>{' '}
            </Form>
          </div>
            <div className="row">
                <div className="col-md">
                    <div className="row no-gutters">
                    {this.state.imageList.map((val, k) => {
                        return (
                        <div className="col-sm-3 columnProperties" key={k}>
                            <img src={val.picture} className="imageProperties"/>
                            <InputGroup.Prepend>
                              <InputGroup.Checkbox
                                onChange={this.onCheck}
                                id={val.id}
                                disabled={ !this.state.checkBoxStatusMap[val.id] && this.state.disableCheckBoxes }
                                hidden={this.state.checkBoxesHidden}
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
