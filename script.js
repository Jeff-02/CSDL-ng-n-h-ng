document.addEventListener("DOMContentLoaded", () => {
  loadBanks();
});
const API_URL = "http://localhost:3000/api/banks";

async function loadBanks() {
  try {
    const response = await fetch(API_URL);
    if (!response.ok) {
      throw new Error("Không thể kết nối tới server.");
    }
    const banks = await response.json();
    renderBanks(banks); 
  } catch (error) {
    console.error("Lỗi khi tải danh sách ngân hàng:", error);
    alert("Có lỗi xảy ra khi tải dữ liệu từ server.");
  }
}

async function addBank(bankData) {
  try {
    const response = await fetch(API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(bankData),
    });

    if (response.status === 201) {
      alert("Thêm ngân hàng thành công!");
      resetForm();
      loadBanks();
    } else {
      const errorMessage = await response.text();
      throw new Error(errorMessage || "Thêm ngân hàng thất bại.");
    }
  } catch (error) {
    console.error("Lỗi khi thêm ngân hàng:", error);
    alert("Lỗi: " + error.message);
  }
}

async function updateBank(id, bankData) {
  try {
    const response = await fetch(`${API_URL}/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(bankData),
    });

    if (response.ok) {
      alert("Cập nhật ngân hàng thành công!");
      resetForm();
      loadBanks(); // Tải lại danh sách
    } else {
      const errorMessage = await response.text();
      throw new Error(errorMessage || "Cập nhật thất bại.");
    }
  } catch (error) {
    console.error("Lỗi khi cập nhật ngân hàng:", error);
    alert("Lỗi: " + error.message);
  }
}

async function deleteBank(id) {
  if (!confirm(`Bạn có chắc chắn muốn xóa ngân hàng có mã "${id}" không?`)) {
    return;
  }
  try {
    const response = await fetch(`${API_URL}/${id}`, {
      method: "DELETE",
    });

    if (response.ok) {
      alert("Xóa ngân hàng thành công!");
      resetForm();
      loadBanks(); // Tải lại danh sách
    } else {
      const errorMessage = await response.text();
      throw new Error(errorMessage || "Xóa thất bại.");
    }
  } catch (error) {
    console.error("Lỗi khi xóa ngân hàng:", error);
    alert("Lỗi: " + error.message);
  }
}

function getBankDataFromForm() {
  return {
    MaNganHang: document.getElementById("maNganHang").value.trim(),
    Ten: document.getElementById("tenNganHang").value.trim(), 
    TruSo: document.getElementById("truSo").value.trim(),
    DiaChi: document.getElementById("diaChi").value.trim(),
    DT_LienHe: document.getElementById("dtLienHe").value.trim(),
    Web: document.getElementById("website").value.trim(),
  };
}

function renderBanks(banks) {
  const tableBody = document.getElementById("tableBody");
  tableBody.innerHTML = ""; 

  if (!banks || banks.length === 0) {
    tableBody.innerHTML =
      '<tr><td colspan="7" style="text-align: center;">Không có dữ liệu để hiển thị.</td></tr>';
    return;
  }

  banks.forEach((bank) => {
    const row = document.createElement("tr");
    row.innerHTML = `
            <td>${bank.MaNganHang}</td>
            <td>${bank.Ten}</td> 
            <td>${bank.TruSo || ""}</td>
            <td>${bank.DiaChi || ""}</td>
            <td>${bank.DT_LienHe || ""}</td>
            <td>${bank.Web || ""}</td> 
            <td>
                <button class="action-btn edit-btn" title="Sửa thông tin"><i class="fas fa-edit"></i></button>
                <button class="action-btn delete-btn" title="Xóa ngân hàng"><i class="fas fa-trash"></i></button>
            </td>
        `;

    row
      .querySelector(".edit-btn")
      .addEventListener("click", () => fillFormForUpdate(bank));
    row
      .querySelector(".delete-btn")
      .addEventListener("click", () => deleteBank(bank.MaNganHang));

    tableBody.appendChild(row);
  });
}

function fillFormForUpdate(bank) {
  document.getElementById("maNganHang").value = bank.MaNganHang;
  document.getElementById("tenNganHang").value = bank.Ten;
  document.getElementById("truSo").value = bank.TruSo || "";
  document.getElementById("diaChi").value = bank.DiaChi || "";
  document.getElementById("dtLienHe").value = bank.DT_LienHe || "";
  document.getElementById("website").value = bank.Web || "";

  document.getElementById("maNganHang").readOnly = true;
  window.scrollTo({ top: 0, behavior: "smooth" });
}

function resetForm() {
  document.getElementById("nganHangForm").reset();
  document.getElementById("maNganHang").readOnly = false;
}


document.getElementById("btnThem").addEventListener("click", () => {
  const bankData = getBankDataFromForm();
  if (!bankData.MaNganHang || !bankData.Ten) {
    alert("Vui lòng nhập đầy đủ Mã và Tên ngân hàng.");
    return;
  }
  addBank(bankData);
});

document.getElementById("btnSua").addEventListener("click", () => {
  const bankData = getBankDataFromForm();

  if (!bankData.MaNganHang || !document.getElementById("maNganHang").readOnly) {
    alert("Vui lòng chọn một ngân hàng từ danh sách bên dưới để sửa.");
    return;
  }
  const dataToUpdate = {
    Ten: bankData.Ten, 
    TruSo: bankData.TruSo,
    DiaChi: bankData.DiaChi,
    DT_LienHe: bankData.DT_LienHe,
    Web: bankData.Web, 
  };
  updateBank(bankData.MaNganHang, dataToUpdate);
});


document.getElementById("btnXoa").addEventListener("click", () => {
  alert(
    "Để xóa, vui lòng nhấn nút xóa ở hàng tương ứng trong danh sách bên dưới."
  );
});

document.getElementById("btnReset").addEventListener("click", resetForm);

async function performSearch() {
  const keyword = document.getElementById("searchInput").value.toLowerCase();

  try {
    const response = await fetch(API_URL);
    const allBanks = await response.json();
    
    const filteredBanks = allBanks.filter((bank) =>
      Object.values(bank).some((value) =>
        String(value).toLowerCase().includes(keyword)
      )
    );

    renderBanks(filteredBanks);
  } catch (error) {
    console.error("Lỗi khi tìm kiếm:", error);
    alert("Có lỗi xảy ra khi tìm kiếm.");
  }
}

document.getElementById("btnSearch").addEventListener("click", performSearch);

document.getElementById("searchInput").addEventListener("keyup", performSearch);
