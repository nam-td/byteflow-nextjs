
import Link from "next/link";

export default function Footer() {
  return (
    <footer>
      <div className="container">
        <p>COPYRIGHT 2023 BYTEFLOW, LLC. ALL RIGHTS RESERVED</p>
        <p>
          Designed and developed by <Link href="/">Huy Le</Link>
        </p>
      </div>
    </footer>
  );
}
