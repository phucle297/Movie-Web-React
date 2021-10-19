import { GROUP_ID, http } from "../../util/setting";

class FilmService {
  GetListFilm() {
    return http.get(`/api/QuanLyPhim/LayDanhSachPhim?maNhom=${GROUP_ID}`);
  }

  GetFilmById(id) {
    return http.get(`/api/QuanLyPhim/LayThongTinPhim?MaPhim=${id}`);
  }

  GetFilmOfCinema(maRap) {
    return http.get(
      `/api/QuanLyRap/LayThongTinLichChieuHeThongRap?maHeThongRap=${maRap}&maNhom=${GROUP_ID}`
    );
  }

  GetScheduleOfFilm(maPhim) {
    return http.get(`/api/QuanLyRap/LayThongTinLichChieuPhim?MaPhim=${maPhim}`);
  }

  GetBanner() {
    return http.get(`/api/QuanLyPhim/LayDanhSachBanner`);
  }

  DeleteFilm(maPhim) {
    return http.delete(`/api/QuanLyPhim/XoaPhim?MaPhim=${maPhim}`);
  }
}
export const filmService = new FilmService();