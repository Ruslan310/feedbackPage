import React, {useState} from 'react';
import styles from './App.module.css';
import Button from "./components/Button/Button";
import {Form, Input, message, FormProps, Rate, Modal} from 'antd';
import UploadPictureReview from './components/Form/UploadPictureReviews';
import {sendBotMessage, sendBotPhoto} from "./util/handle";
import {colorTheme} from "./util/themes";
import LogoSvg, {logoType} from "./components/svg/LogoSvg";
import ContactSvg from "./components/svg/ContactSvg";
import {COMPANY_INFO} from "./constants";

const {TextArea} = Input;

interface FieldTypeReview {
  name: string;
  company: string;
  phone: number;
  rate: number;
  review: string;
}

const App = () => {
  const [form] = Form.useForm();
  const [picture, setPicture] = useState('');
  const [isLoadingImage, setLoadingImage] = useState(false);
  const [isFetching, setFetching] = useState(false);
  const [openModal, setOpenModal] = useState(false);

  const reset = () => {
    form.resetFields();
    setPicture('')
  }

  const submit: FormProps<FieldTypeReview>['onFinish'] = async (values) => {
    try {
      setFetching(true)
      const {phone, name, review, company, rate} = values;
      if (phone && name && review && company && rate) {

        const mes = `-----Review From Service-----
👤 ${name}
🎟️ ${company}
📞 ${phone}
${'⭐'.repeat(rate)}
💬 ${review}`;

        await sendBotMessage(mes)

        if (picture) {
          await sendBotPhoto(picture)
        }

        reset()
        setOpenModal(true);
        message.success({content: 'Review successfully saved!', duration: 2});
        setFetching(false)
      }
    } catch (err) {
      setFetching(false)
      console.log('----err', err)
      message.error({content: "Something's wrong..", duration: 2});
    }
  }

  return (
    <div className={styles.page}>
      <Modal
        open={openModal}
        onCancel={() => setOpenModal(false)}
        footer={false}
        width={460}>
        <div className={styles.messageContainer}>
          <h3>Review successfully sent!</h3>
          <Button onClick={() => setOpenModal(false)}>OK</Button>
        </div>
      </Modal>
      <Form
        form={form}
        className={styles.form}
        name="basic"
        layout="vertical"
        onFinish={submit}
        autoComplete="off"
        requiredMark={false}
      >
        <div className={styles.buttonContainer}>
          <LogoSvg type={logoType.HORIZONTAL} />
        </div>
        <Form.Item<FieldTypeReview>
          label="Name"
          name="name"
          className={styles.input}
          rules={[
            { required: true, message: 'Please input your name!' },
          ]}
        >
          <Input placeholder="Enter your name" />
        </Form.Item>
        <Form.Item<FieldTypeReview>
          label="Company"
          name="company"
          className={styles.input}
          rules={[
            { required: true, message: 'Please input your company name!' },
          ]}
        >
          <Input placeholder="Enter your company name" />
        </Form.Item>
        <Form.Item<FieldTypeReview>
          label="Telephone"
          name="phone"
          className={styles.input}
          rules={[
            { required: true, message: 'Please input your phone number!' },
            {
              pattern: /^\+?[0-9]{10,15}$/,
              message: 'Please enter a valid phone number!',
            },
          ]}
        >
          <Input placeholder="+357" />
        </Form.Item>
        <Form.Item<FieldTypeReview>
          className={styles.input}
          name="rate"
          label='Rate us'
          rules={[{required: true, message: 'Please select a rating'}]}
        >
          <Rate style={{color: colorTheme.rate}} />
        </Form.Item>
        <Form.Item<FieldTypeReview>
          className={styles.input}
          name="review"
          rules={[{required: true, message: 'Enter your feedback'}]}
        >
          <TextArea rows={4} placeholder="Share your feedback with us"/>
        </Form.Item>
        <UploadPictureReview
          label='Attach an image - optional'
          picture={picture}
          setPicture={setPicture}
          load={isLoadingImage}
          setLoad={setLoadingImage}
        />
        <Form.Item className={styles.buttonContainer}>
          <Button disabled={isLoadingImage} loading={isFetching} type="submit">
            <p className={styles.submitButton}>Send feedback</p>
          </Button>
        </Form.Item>
      </Form>
      <div className={styles.footerBlock}>
        <div className={styles.socialBlock}>
          <h2 className={styles.footerTitle}>Our social media</h2>
          <div style={{display: 'flex'}}>
            <a href="https://www.facebook.com/share/K9So7LYNbbwQbUc9/" target="_blank" rel="noreferrer">
              <ContactSvg color={colorTheme.darkPrimary} className={styles.socialButton} type='FACEBOOK'/>
            </a>
            <a style={{marginLeft: 20}} href="https://www.instagram.com/dine_nation_cy/?igsh=MWxpczA2NzVkZHVtZQ%3D%3D" target="_blank" rel="noreferrer">
              <ContactSvg color={colorTheme.darkPrimary} className={styles.socialButton} type='INSTAGRAM'/>
            </a>
          </div>
        </div>
        <div className={styles.footerContactUs}>
          <h2 className={styles.footerTitle}>Contact Us</h2>
          <div className={styles.footerContactUsItem}>
            <ContactSvg color={colorTheme.darkPrimary} type='ADDRESS'/>
            <p className={styles.contactText}>{COMPANY_INFO.ADDRESS}</p>
          </div>
          <div className={styles.footerContactUsItem}>
            <ContactSvg color={colorTheme.darkPrimary} type='EMAIL'/>
            <p className={styles.contactText}>{COMPANY_INFO.EMAIL}</p>
          </div>
          <div className={styles.footerContactUsItem}>
            <ContactSvg color={colorTheme.darkPrimary} type='PHONE'/>
            <p className={styles.contactText}>{COMPANY_INFO.PHONE}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default App;
