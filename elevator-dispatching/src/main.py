import sys
from app_frame import *


if __name__ == '__main__':

    app = QApplication(sys.argv)
    ex = App()
    ex.show()

    sys.exit(app.exec())  # 应用程序主循环
