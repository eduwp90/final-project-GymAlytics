import { EditOutlined, FileDoneOutlined } from "@ant-design/icons";
import { Avatar, Card, Image, InputNumber, Form, Button } from "antd";
import Meta from "antd/lib/card/Meta";
import React, { useEffect, useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { calculateBMI } from "../helpers";
import { IDatesResponse } from "../interfaces";
import AuthService from "../Services/authService";
import { getUserProfile, updateUserProfile } from "../Services/dbService";

const Profile: React.FC = () => {
  const [user] = useAuthState(AuthService.auth);
  const [profile, setProfile] = useState<IDatesResponse>();
  const [isDisabled, setIsDisabled] = useState<boolean>(true);
  const [weight, setWeight] = useState<number | undefined>();
  const [height, setHeight] = useState<number | undefined>();
  const [mounted, setMounted] = useState<boolean>(true);
  const [bmi, setBmi] = useState<number | undefined>();

  function handleEdit() {
    if (profile) {
      setIsDisabled(false);
    }
    console.log(profile);
  }

  useEffect(() => {
    console.log("mounting");
    setMounted(true);
    return () => {
      setMounted(false);
    };
  }, []);

  useEffect(() => {
    console.log("using effect");
    let userProfile: IDatesResponse | undefined;
    const getUserInfo = async () => {
      if (user && mounted) {
        userProfile = await getUserProfile(user.uid);
      }
      console.log(userProfile);
      if (userProfile && mounted) {
        setProfile(userProfile);
        setWeight(userProfile.weight);
        setHeight(userProfile.height);
        setBmi(userProfile.bmi);
      }
    };
    getUserInfo();
  }, [user]);

  const onFinish = async (): Promise<void> => {
    if (user && mounted && height && weight) {
      const newBmi: number = calculateBMI(height, weight);
      setBmi(newBmi);
      if (weight && height) {
        const newProfile = await updateUserProfile(user.uid, height, weight, newBmi);
        setProfile(newProfile);
      }
    }
  };
  function onWeightChange(e: number) {
    setWeight(e);
  }
  function onHeightChange(e: number) {
    setHeight(e);
  }

  return (
    <div className="ant-layout-content">
      {profile && (
        <div>
          <div className="profile-card">
            <Card
              style={{ width: 300 }}
              actions={[
                <div onClick={handleEdit}>
                  <span>edit </span>
                  <EditOutlined key="edit" />
                </div>
              ]}>
              <Meta
                avatar={
                  <Avatar
                    src={
                      profile.photoURL !== "" && <Image src={profile.photoURL} style={{ width: 32 }} preview={false} />
                    }>
                    {!profile.photoURL && `${profile.name.charAt(0).toUpperCase()}`}
                  </Avatar>
                }
                title={profile.name + " " + profile.surname}
                description={"bmi: " + bmi?.toFixed(1)}
              />
              <Form className="BMI-form" onFinish={onFinish}>
                <Form.Item name={"weight"} label="weight" initialValue={weight}>
                  <InputNumber
                    name="weight"
                    size="large"
                    placeholder={weight?.toString() || "Weight"}
                    style={{ width: 120 }}
                    disabled={isDisabled}
                    onChange={onWeightChange}
                  />
                  <span> kg</span>
                </Form.Item>
                <Form.Item name={"height"} label="height" initialValue={height}>
                  <InputNumber
                    size="large"
                    placeholder={height?.toString() || "Height"}
                    style={{ width: 120 }}
                    disabled={isDisabled}
                    onChange={onHeightChange}
                  />
                  <span> cm</span>
                </Form.Item>
                <Button htmlType="submit">
                  <span>submit </span>
                  <FileDoneOutlined key="sumbit" />
                </Button>
              </Form>
            </Card>
          </div>
        </div>
      )}
    </div>
  );
};

export default Profile;
