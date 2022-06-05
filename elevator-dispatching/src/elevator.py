import time
from PyQt6.QtCore import QThread, pyqtSignal
from PyQt6 import QtCore
from PyQt6.QtGui import *
from PyQt6.QtWidgets import *
from typing import *
from utils import *
from customized_widget import *
from app_views import *


class Elevator(QThread):
    # 实例化一个信号对象
    trigger = pyqtSignal(int)
    updater = pyqtSignal(int)
    index: int

    def __init__(self, idx: int, app, parent: Optional[QWidget] = ..., flags: QtCore.Qt.WindowType = ...) -> None:
        super(Elevator, self).__init__()
        self.index = idx
        self.app = app
        self.trigger.connect(self.app.check)
        self.updater.connect(self.app.update)

    def run(self) -> None:
        while (1):
            self.trigger.emit(self.index)
            time.sleep(0.2)

            if self.app.shouldSleep[self.index - 1] == 1:
                self.app.mainView.findChild(QLabel, f"open{self.index}").setStyleSheet(
                    "QLabel{image: url(resources/elevator_open.png); image-position:center}")
                time.sleep(2)
                self.app.mainView.findChild(QLabel, f"open{self.index}").setStyleSheet(
                    "QLabel{image: url(resources/elevator_closed.png); image-position:center}")
                self.app.shouldSleep[self.index - 1] = 0
                time.sleep(1)

            self.updater.emit(self.index)
            time.sleep(1)
