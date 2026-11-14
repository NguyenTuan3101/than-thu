# 01 — Game Design Document

**Working title:** THẦN THỤ  
**Genre:** Roguelite survival (Đồ Đằng) + Clan management (Thần Thụ)  
**Platform:** Web (desktop-first, mobile OK)  
**Fantasy:** Bạn không chơi người — bạn là **Đồ Đằng / Thần Thụ** của một gia tộc.

---

## 1. Pitch

Từ một dây đằng yếu ớt trên giấy tuyên, bạn bị gieo vào những thế giới khắc nghiệt. Mỗi lần sống sót và **Suy diễn**, rễ bạn ăn sâu hơn vào vận mệnh. Khi thành **Thần Thụ**, tộc nhân cúng tế và nhận **ban chỉ** từ bạn — bạn dẫn gia tộc tranh thiên hạ với các gia tộc khác.

---

## 2. Pillars

| Pillar | Nghĩa | Rule |
|--------|-------|------|
| **Kiếp đằng** | Mỗi thế giới là một kiếp sống còn | Lựa chọn > combat cơ học nặng |
| **Sống lâu = mạnh** | Thời gian sống trong kiếp cho năng lực | Risk: ở thêm mùa vs về an toàn |
| **Thụ trị tộc** | Thần Thụ ban chỉ, không micro từng người | Lệnh có chi phí uy / linh |
| **Giấy tuyên** | Map, UI, rễ = mực trên giấy | Đọc được trước đã đẹp |

---

## 3. Hai lớp chơi

### A. Lớp Đột sinh / Suy diễn (roguelite)

1. Ngoài “Gia từ” (hub): tích **điểm Suy diễn**.  
2. Đủ ngưỡng → mở **Kỳ Suy diễn**.  
3. Gieo ngẫu nhiên vào thế giới (tag: khô hạn, chiến tranh, linh điền, độc khí…).  
4. Theo **mùa / năm**: chọn hành động (bám đất, hút linh, ẩn, kết giao người, tranh ánh sáng…).  
5. Chết / về / bị đốn → kết kiếp: giữ một phần năng lực + điểm meta.  
6. Sống đủ lâu + điều kiện → **Thăng Thần Thụ** (mở lớp B).

### B. Lớp Gia tộc (management nhẹ)

Khi là Thần Thụ:

- Nhận **cúng tế** (linh, máu thề, đất).  
- Ra **ban chỉ** (mở đất, kết hôn chính trị, chiến, ẩn tu, tế lễ…).  
- Cạnh tranh **gia tộc khác** (uy, đất, thần thụ địch).  
- Mục tiêu dài: mở rộng / tranh Thiên Mệnh / nhiều đằng nhánh.

---

## 4. Core loop

```
Hub gia từ
  → tích Suy diễn
  → gieo vào thế giới
  → sống còn + lựa chọn theo mùa
  → nhận năng lực (theo tuổi thọ kiếp)
  → (lặp) đến khi đủ điều kiện
  → Thần Thụ
  → ban chỉ trị tộc + cạnh tranh
  → dùng tài nguyên tộc nuôi kiếp đằng mới / nhánh rễ
```

---

## 5. Hệ thống chính (MVP)

### 5.1 Đồ Đằng stats

| Chỉ số | Vai trò |
|--------|---------|
| **Sinh lực** | Chết khi về 0 |
| **Rễ** | Bám đất / chống bão |
| **Linh hấp** | Hút linh khí môi trường |
| **Ẩn** | Tránh bị phát hiện / đốn |
| **Tuổi kiếp** | Sống càng lâu càng mở trait |
| **Suy diễn** (meta) | Mở kỳ + unlock vĩnh viễn |

### 5.2 Năng lực

- Mở bằng **tuổi kiếp** + sự kiện + suy diễn thành công.  
- Ví dụ: chịu hạn, hút máu đất, kết giao với người, độc nhựa, phân thân nhánh…  
- Không skill bar ARPG — là **passive / lựa chọn mùa**.

### 5.3 Thế giới (seed tags)

Mỗi run roll 2–4 tag:

| Tag | Khắc | Cơ hội |
|-----|------|--------|
| Khô hạn | Sinh lực − | Trait chịu hạn |
| Chiến tranh | Bị đốn / cháy | Kết giao / ẩn |
| Linh điền | Cạnh tranh hút linh | Linh hấp tăng nhanh |
| Độc khí | DoT | Độc nhựa |
| Sương cổ | Chậm phát triển | Ẩn mạnh |
| Thị tộc gần | Nguy bị thờ / bị chặt | Cúng tế sớm (hiếm) |

### 5.4 Ban chỉ (post–Thần Thụ)

Mỗi ban chỉ tốn **Uy thụ** hoặc **Linh cúng**.  
Ví dụ lệnh MVP: *Khai荒*, *Thu nhận đệ tử đất*, *Tránh chiến 1 mùa*, *Tế rễ*, *Do thám gia tộc địch*.

### 5.5 Gia tộc (nhẹ)

- Dân số, uy tín, kho linh, đất.  
- 1–2 gia tộc địch AI đơn giản.  
- Không sim 1000 NPC.

---

## 6. Progression fantasy

1. **Đằng non** — chết sớm, học tag thế giới  
2. **Cổ đằng** — sống nhiều mùa, build năng lực  
3. **Thần Thụ** — hub đổi sang trị tộc  
4. **Thần Thụ mở nhánh** — gieo đằng con / kiếp mới để farm trait  

Emotional win: gia tộc mang tên bạn trên bản đồ giấy; ấn son ban chỉ đóng xuống.

---

## 7. Scope MVP

| Có | Chưa |
|----|------|
| Hub + 1 quy trình Suy diễn | Multiplayer |
| 6–8 tag thế giới | 100 biome |
| 12–20 năng lực | Combat realtime |
| 1 gia tộc player + 2 địch đơn giản | Diplomacy sâu |
| Ban chỉ 6–8 lệnh | Mod marketplace |
| Art giấy tuyên + mực | 3D |

**Một run mẫu MVP:**  
Hub → suy diễn → roll thế giới khô hạn+linh điền → sống 8 mùa → mở 3 trait → chết/về → meta unlock → lặp đến Thần Thụ → ban chỉ khai đất một lần → thắng điều kiện “Uy ≥ X”.

---

## 8. Out of scope (cố ý)

- Unity / Action RPG di chuyển  
- VẠN ĐẠO systems (đạo người chơi, combat skill)  
- AI tự viết luật thế giới không kiểm soát  

---

## Related

- [02_Art_Direction.md](02_Art_Direction.md)
- [03_Tech_Stack.md](03_Tech_Stack.md)
- [04_MVP_Roadmap.md](04_MVP_Roadmap.md)
