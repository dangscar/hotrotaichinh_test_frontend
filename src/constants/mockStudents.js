export const MOCK_STUDENTS = [
    {
        name: "Nguyễn Văn A",
        email: "nvacntt2211001@student.ctuet.edu.vn",
        password: "nva001AA",
        mssv: "NVACNTT2211001",
        dob: "11/10/2004",
        major: "Công nghệ thông tin",
        cohort: "K10",
        degreeType: "Đại học chính quy",
        phone: "0982394224",
        cccd: "079204001948",
        bankAcc: "1024508930",
        address: "Khu vực 2, Đường Nguyễn Văn Cừ kéo dài, An Khánh, Ninh Kiều, Cần Thơ",
        hokhau: "Ấp Thới Thuận, Xã Thới Đông, Huyện Cờ Đỏ, Thành phố Cần Thơ"
    },
    {
        name: "Nguyễn Văn B",
        email: "nvbcntt2211002@student.ctuet.edu.vn",
        password: "nvb002BB",
        mssv: "NVBCNTT2211002",
        dob: "25/08/2004",
        major: "Công nghệ thông tin",
        cohort: "K10",
        degreeType: "Đại học chính quy",
        phone: "0912345678",
        cccd: "079204008899",
        bankAcc: "1024509988",
        address: "3/2 Xuân Khánh, Ninh Kiều, Cần Thơ",
        hokhau: "Phường Xuân Khánh, Quận Ninh Kiều, Thành phố Cần Thơ"
    },
    {
        name: "Nguyễn Văn C",
        email: "nvccntt2211003@student.ctuet.edu.vn",
        password: "nvc003CC",
        mssv: "NVCCNTT2211003",
        dob: "05/12/2004",
        major: "Công nghệ thông tin",
        cohort: "K10",
        degreeType: "Đại học chính quy",
        phone: "0909887766",
        cccd: "079204007766",
        bankAcc: "1024507766",
        address: "Mậu Thân, An Hòa, Ninh Kiều, Cần Thơ",
        hokhau: "Phường An Hòa, Quận Ninh Kiều, Thành phố Cần Thơ"
    },
    {
        name: "Nguyễn Thụy Phương Anh",
        email: "ntpanhcntt2211050@student.ctuet.edu.vn",
        password: "nvc003CC",
        mssv: "CNTT2211050",
        dob: "05/12/2004",
        major: "Công nghệ thông tin",
        cohort: "K10",
        degreeType: "Đại học chính quy",
        phone: "0909887766",
        cccd: "079204007766",
        bankAcc: "1024507766",
        address: "Mậu Thân, An Hòa, Ninh Kiều, Cần Thơ",
        hokhau: "Phường An Hòa, Quận Ninh Kiều, Thành phố Cần Thơ"
    }
];

export const getStudentByEmail = (email) => {
    if (!email) return null;
    const cleanEmail = email.trim().toLowerCase();
    return MOCK_STUDENTS.find(s => s.email.toLowerCase() === cleanEmail);
};

export const getStudentById = (id) => {
    if (!id) return null;
    const cleanId = id.trim().toUpperCase();
    return MOCK_STUDENTS.find(s => s.mssv.toUpperCase() === cleanId);
};
