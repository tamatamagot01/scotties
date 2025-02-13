สิ่งที่ต้องทำ

[สิ่งที่ต้องทำวันพรุ่งนี้ -> 1. ย้าย function สำหรับการ set user ด้วย zustand ไปเก็บใน localStorage ย้ายไปไว้ใน Page Login เลย (นั่นคือ login เสร็จก็ให้ set user เก็บด้วย zustand ทันที), 2. ทำหน้า store โดยใช้ pathParams และ searchParams ควบคู่กัน, 3. เอา daisyUI มาใช้ใน project (พวกตรง carousel ที่แสดง brand ทั้งหมด ในหน้า root ลองเอามาใช้ดู)]

<!-- 0. เพิ่มสินค้าเข้า database ที่ไม่ใช่หมวด shoes -->

<!-- 1. หน้า /admin/login -> ทำการ Authentication ให้เสร็จ ว่า user ที่ login เข้ามามี role เป็น admin ไหม -->

<!-- 2. หน้า /admin/login -> สร้าง API สำหรับ login ให้เสร็จ -->

<!-- 3. หน้า /admin/login -> ทำ desktop size -->

<!-- 4. หน้า /admin/dashboard -> ยังไม่เพิ่มว่าต้อง login แบบ admin ก่อน ถึงเข้าหน้านี้ได้ (หากยังไม่ login แบบ admin จะ redirect ไปหน้าอื่น) -->

<!-- 5. หน้า /admin/dashboard -> ทำ mobile size -->

<!-- 6. หน้า /register -> ยังไม่ใช้ API ไป register ที่ back-end สำหรับสร้าง user -->

<!-- 7. หน้า /register -> อย่าลืมแสดง error หาก user ทำอะไรผิด -->

<!-- 8. หน้า /login -> อย่าลืมแสดง error หาก user ทำอะไรผิด -->

9. หน้า /login -> จัดการระบบ forgot password ให้เสร็จ

10. หน้า /admin/login -> จัดการระบบ forgot password ให้เสร็จ

<!-- 11. หน้า root -> ทำ desktop size ให้เสร็จ -->

12. หน้า root -> รูปสินค้า และข้อมูลสินค้า เปลี่ยนจากการใช้แบบ static เป็น fetch มาจาก database

13. หน้า root -> หลายอย่างที่ต้องทำ พวกปุ่มต่างๆยังใช้งานไม่ได้

14. หน้า root -> ตรงปุ่มแว่นขยาย อย่าลืมเอา asyncselect มาใช้หาสินค้า แบบ query

15. Navbar -> ปุ่มต่างๆยังใช้งานจริงไม่ได้ ยังไม่พาไปหน้าไหน

16. หน้า /profile -> ทำให้เสร็จ พวกปุ่มต่างๆ

17. แก้ปัญหาที่เวลา logout แล้ว profile ยังค้าง หรือบางทีหน้าก็กระพริบไปมา

18. ทำการ loading ระหว่างจะย้ายหน้า (ดูไฟล์ /app/(admin)/admin/dashboard/page.tsx) เป็นตัวอย่าง
