import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { USER_ACCOUNT } from "../../util/setting";
import { message } from "antd";
import { Redirect } from "react-router-dom";
import "./BookingTicketPage.css";
import {
  BookingTicketAction,
  GetChairsAction,
} from "../../redux/actions/TicketAction";
import _ from "lodash";
import CountDown from "../../components/CountDown/CountDown";
import { Prompt } from "react-router-dom/cjs/react-router-dom.min";

export default function BookingTicketPage(props) {
  const [arrTicketChose, setArrTicketChose] = useState([]);
  if (_.has(arrTicketChose, "2")) console.log(1);
  const { filmChoice } = useSelector((state) => state.FilmReducer);
  const { filmTicketData } = useSelector((state) => state.TicketReducer);
  const userLogin = JSON.parse(localStorage.getItem(USER_ACCOUNT));
  const dispatch = useDispatch();
  const [isBooked, setBooked] = useState(false);
  useEffect(() => {
    const action = GetChairsAction(props.match.params.id);
    dispatch(action);
  }, []);
  useEffect(() => {
    document.title = filmChoice.tenPhim;
  }, [filmChoice.tenPhim]);
  const calSum = () => {
    let sum = arrTicketChose.reduce((sum, ghe, index) => {
      return (sum += ghe.giaVe);
    }, 0);
    return sum;
  };
  const renderSelectedChair = () => {
    return arrTicketChose.map((chair) => {
      return (
        <li className="flex items-center justify-between">
          <p className="font-bold">{chair.tenGhe}</p>
          <p>{chair.giaVe}</p>
        </li>
      );
    });
  };
  const renderChair = () => {
    return filmTicketData?.danhSachGhe?.map((chair, index) => {
      let chairClass = "chair";
      if (chair.loaiGhe === "Vip") chairClass = "chair-vip";
      if (chair.daDat) chairClass = "chair-booked";
      if (_.some(arrTicketChose, { maGhe: chair.maGhe }))
        chairClass = "chair-booking";

      return (
        <button
          key={index}
          className={chairClass}
          onClick={() => {
            let arrTicketUpdate = [...arrTicketChose];
            if (_.some(arrTicketUpdate, { maGhe: chair.maGhe })) {
              arrTicketUpdate = arrTicketUpdate.filter(
                (ghe) => ghe.maGhe !== chair.maGhe
              );
            } else arrTicketUpdate.push(chair);
            setArrTicketChose(arrTicketUpdate);
          }}
          disabled={chair.daDat}
        >
          {chair.tenGhe}
        </button>
      );
    });
  };
  if (!localStorage.getItem(USER_ACCOUNT)) {
    message.error("Vui l??ng ????ng nh???p tr?????c khi ?????t v??!");
    return <Redirect to="/login" />;
  }
  return (
    <>
      <div className="booking-ticket my-3">
        <div className="container mx-auto grid grid-cols-12 shadow-xl p-4">
          <div className="screen col-span-12 md:col-span-9 md:pr-4 md:pt-4 mb-3">
            <CountDown />
            <div className="" id="trapezoid">
              <p className="text-white text-center font-bold mt-2">M??n h??nh</p>
            </div>
            <div className="chairs">{renderChair()}</div>
          </div>
          <div className="payment-detail col-span-12 md:col-span-3">
            <h3 className="text-green-500 text-center text-3xl font-bold">
              {calSum()}??
            </h3>
            <hr className="my-2" />
            <h3 className="text-xl font-bold">
              {filmTicketData?.thongTinPhim?.tenPhim}
            </h3>
            <p>
              <span className="font-bold">?????a ??i???m: </span>
              {filmTicketData?.thongTinPhim?.diaChi}
            </p>
            <p>
              <span className="font-bold">Ng??y chi???u: </span>
              {filmTicketData?.thongTinPhim?.ngayChieu}
            </p>
            <hr className="my-2" />
            <div className="grid grid-cols-2 text-lg">
              <span className="text-red-400 font-bold">Gh???</span>
              <span className="text-right text-green-500 font-bold">
                {calSum()}??
              </span>
            </div>
            <ul className="mt-2 px-1.5 ticketChose">{renderSelectedChair()}</ul>
            <hr className="my-2" />
            <ul className="">
              <li className="flex justify-between">
                <p className="font-bold">H??? t??n</p>
                <p>{userLogin.hoTen}</p>
              </li>
              <li className="flex justify-between">
                <p className="font-bold">Email</p>
                <p>{userLogin.email}</p>
              </li>
              <li className="flex justify-between">
                <p className="font-bold">S??? ??i???n tho???i</p>
                <p>{userLogin.soDt || userLogin.soDT}</p>
              </li>
            </ul>
            <div className="payment-detail-control">
              <p className="text-center w-full">
                <span className="text-red-600 font-bold">L??u ??: </span>
                <span>V?? ???? mua kh??ng th??? ?????i ho???c ho??n ti???n!</span>
              </p>
              <button
                className="bg-red-500 hover:bg-red-600 text-white py-2 px-10 rounded block mx-auto "
                onClick={() => {
                  const action = BookingTicketAction({
                    maLichChieu: props.match.params.id,
                    danhSachVe: arrTicketChose,
                  });
                  setBooked(true);
                  dispatch(action);
                }}
              >
                ?????t v??
              </button>
            </div>
          </div>
        </div>
      </div>
      <Prompt
        when={!isBooked}
        message={"B???n ch??a ho??n t???t ?????t v??, b???n c?? mu???n tho??t kh??ng?"}
      />
    </>
  );
}
