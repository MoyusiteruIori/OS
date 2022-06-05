from PyQt6.QtCore import Qt
from PyQt6 import QtCore
from PyQt6.QtGui import *
from PyQt6.QtWidgets import *
from typing import *
from utils import *
from customized_widget import *
from app_views import *
from elevator import Elevator


class App(QWidget):

    edtElv: QLineEdit
    edtFlr: QLineEdit
    mainView: MainView
    elevatorGoal: List[Set[Dest]]
    shouldSleep: List[int]
    state: List[int]
    pause: List[int]
    floor: List[int]

    def __init__(self, parent: Optional['QWidget'] = ..., flags: QtCore.Qt.WindowType = ...) -> None:
        super().__init__()
        self.initUI()

    def initUI(self):
        vbox = QVBoxLayout(self)
        hbox1 = QHBoxLayout()
        hbox1.addStretch(1)
        hbox2 = QHBoxLayout()
        hbox2.addStretch(1)
        hbox3 = QHBoxLayout()
        hbox3.addStretch(1)
        vbox.addLayout(hbox1, 10)
        vbox.addLayout(hbox2, 10)
        vbox.addLayout(hbox3, 10)
        labElv = QLabel('请输入电梯数(1 - 10): ')
        labFlr = QLabel('请输入楼层数(1 - 30): ')
        self.edtElv = QLineEdit()
        self.edtFlr = QLineEdit()

        hbox1.addWidget(labElv)
        hbox1.addWidget(self.edtElv)
        hbox2.addWidget(labFlr)
        hbox2.addWidget(self.edtFlr)

        btn = QPushButton('确认', self)
        btn.clicked.connect(self.run)
        btnd = QPushButton('选择默认(5电梯20层)', self)
        btnd.clicked.connect(self.run)

        hbox3.addWidget(btn, alignment=Qt.AlignmentFlag.AlignCenter)
        hbox3.addWidget(btnd, alignment=Qt.AlignmentFlag.AlignCenter)
        self.setWindowTitle('参数设置')

    def run(self):

        if self.sender().text() == '确认':
            try:
                self.numElevator = int(self.edtElv.text())
            except:
                self.numElevator = 5

            try:
                self.numFloor = int(self.edtFlr.text())
            except:
                self.numFloor = 20
        else:
            self.numElevator = 5
            self.numFloor = 20

        if self.numElevator < 1 or self.numElevator > 10:
            self.numElevator = 5
        if self.numFloor < 1 or self.numFloor > 30:
            self.numFloor = 20

        self.elevatorGoal: List[Set[Dest]] = [set()
                                               for _ in range(self.numElevator)]
        self.shouldSleep = [0 for _ in range(self.numElevator)]

        self.state = [0 for _ in range(self.numElevator)]

        self.pause = [1 for _ in range(self.numElevator)]

        self.floor = [1 for _ in range(self.numElevator)]

        ths = [Elevator(i + 1, self) for i in range(self.numElevator)]
        for thd in ths:
            thd.start()

        self.mainView = MainView(self.numElevator, self.numFloor, self.setInternalDest,
                                 self.changePause, self.openDoor, self.setExternalDestUp, self.setExternalDestDown)
        self.mainView.show()
        self.close()

    def check(self, elvIndex: int) -> None:

        if self.pause[elvIndex - 1] == 0:
            return

        def hasGoal(flr: int, dir: int):
            for goal in self.elevatorGoal[elvIndex - 1]:
                if goal.flr == flr and goal.dir == dir:
                    return True
            return False

        self.mainView.findChild(QLCDNumber, "{0}".format(
            elvIndex)).display(self.floor[elvIndex - 1])
        self.mainView.findChild(QPushButton, "{0}+{1}".format(elvIndex, self.floor[elvIndex - 1])).setStyleSheet(
            "QPushButton{}")    # 松开该层的电梯内按钮

        if self.state[elvIndex - 1] == DOWN:
            self.mainView.findChild(QPushButton, "down{0}".format(self.floor[elvIndex - 1])).setStyleSheet(
                "QPushButton{}")  # 松开走廊该层下行按钮

            if hasGoal(self.floor[elvIndex - 1], DOWN):  # 如果该层是电梯此前的下行目标，则暂停开门
                self.shouldSleep[elvIndex - 1] = 1
                # 并移除目标
                self.elevatorGoal[elvIndex -
                                   1].discard(Dest(self.floor[elvIndex - 1], DOWN))
                self.mainView.elevatorView.logger.emit(
                    f" {elvIndex} 号电梯到达了第 {self.floor[elvIndex - 1]} 层。")
            if hasGoal(self.floor[elvIndex - 1], UP) and min(self.elevatorGoal[elvIndex - 1]).flr == self.floor[elvIndex - 1]:
                self.shouldSleep[elvIndex - 1] = 1
                self.elevatorGoal[elvIndex -
                                   1].discard(Dest(self.floor[elvIndex - 1], UP))
                self.mainView.findChild(QPushButton, "up{0}".format(self.floor[elvIndex - 1])).setStyleSheet(
                    "QPushButton{}")
                self.mainView.elevatorView.logger.emit(
                    f" {elvIndex} 号电梯到达了第 {self.floor[elvIndex - 1]} 层。")

        if self.state[elvIndex - 1] == UP:
            self.mainView.findChild(QPushButton, "up{0}".format(self.floor[elvIndex - 1])).setStyleSheet(
                "QPushButton{}")  # 松开走廊该层上行按钮

            if hasGoal(self.floor[elvIndex - 1], UP):   # 如果该层是电梯此前的上行目标，则暂停开门
                self.shouldSleep[elvIndex - 1] = 1
                # 并移除目标
                self.elevatorGoal[elvIndex -
                                   1].discard(Dest(self.floor[elvIndex - 1], UP))
                self.mainView.elevatorView.logger.emit(
                    f" {elvIndex} 号电梯到达了第 {self.floor[elvIndex - 1]} 层。")
            if hasGoal(self.floor[elvIndex - 1], DOWN) and max(self.elevatorGoal[elvIndex - 1]).flr == self.floor[elvIndex - 1]:
                self.shouldSleep[elvIndex - 1] = 1
                self.elevatorGoal[elvIndex -
                                   1].discard(Dest(self.floor[elvIndex - 1], DOWN))
                self.mainView.findChild(QPushButton, "down{0}".format(self.floor[elvIndex - 1])).setStyleSheet(
                    "QPushButton{}")  # 松开走廊该层下行按钮
                self.mainView.elevatorView.logger.emit(
                    f" {elvIndex} 号电梯到达了第 {self.floor[elvIndex - 1]} 层。")

    def update(self, elvIndex: int) -> None:
        # 状态更新
        if self.state[elvIndex - 1] == DOWN:
            if len(self.elevatorGoal[elvIndex - 1]) == 0:
                self.state[elvIndex - 1] = STOP
                self.mainView.findChild(QLabel, f"dir{elvIndex}").setStyleSheet(
                    f"#dir{elvIndex}" + "{image: url(resources/elevator_stop.png); image-position:center}")
            else:
                if min(self.elevatorGoal[elvIndex - 1]).flr > self.floor[elvIndex - 1]:
                    self.state[elvIndex - 1] = UP
                    self.mainView.findChild(QLabel, f"dir{elvIndex}").setStyleSheet(
                        f"#dir{elvIndex}" + "{image: url(resources/elevator_up.png); image-position:center}")

        if self.state[elvIndex - 1] == UP:
            if len(self.elevatorGoal[elvIndex - 1]) == 0:
                self.state[elvIndex - 1] = STOP
                self.mainView.findChild(QLabel, f"dir{elvIndex}").setStyleSheet(
                    f"#dir{elvIndex}" + "{image: url(resources/elevator_stop.png); image-position:center}")
            else:
                if max(self.elevatorGoal[elvIndex - 1]).flr < self.floor[elvIndex - 1]:
                    self.state[elvIndex - 1] = DOWN
                    self.mainView.findChild(QLabel, f"dir{elvIndex}").setStyleSheet(
                        f"#dir{elvIndex}" + "{image: url(resources/elevator_down.png); image-position:center}")

        if self.state[elvIndex - 1] == STOP:
            if len(self.elevatorGoal[elvIndex - 1]) != 0 and (
                    max(self.elevatorGoal[elvIndex - 1]).flr > self.floor[elvIndex - 1]):
                self.state[elvIndex - 1] = UP
                self.mainView.findChild(QLabel, f"dir{elvIndex}").setStyleSheet(
                    f"#dir{elvIndex}" + "{image: url(resources/elevator_up.png); image-position:center}")
            if len(self.elevatorGoal[elvIndex - 1]) != 0 and (
                    min(self.elevatorGoal[elvIndex - 1]).flr < self.floor[elvIndex - 1]):
                self.state[elvIndex - 1] = DOWN
                self.mainView.findChild(QLabel, f"dir{elvIndex}").setStyleSheet(
                    f"#dir{elvIndex}" + "{image: url(resources/elevator_down.png); image-position:center}")

        if self.state[elvIndex - 1] == STOP:
            pass
        elif self.state[elvIndex - 1] == DOWN:
            self.floor[elvIndex - 1] -= 1
        elif self.state[elvIndex - 1] == UP:
            self.floor[elvIndex - 1] += 1

        self.mainView.findChild(QLCDNumber, "{0}".format(
            elvIndex)).display(self.floor[elvIndex - 1])
        self.mainView.findChild(Slider, "sld{0}".format(elvIndex)).setValue(
            (self.floor[elvIndex - 1] - 1) * 100 // self.numFloor)

    def openDoor(self, elvIndex):
        if self.state[elvIndex - 1] == STOP:
            self.shouldSleep[elvIndex - 1] = 1

    def changePause(self, elvIndex):
        if self.pause[elvIndex - 1] == 0:
            self.pause[elvIndex - 1] = 1
            self.mainView.findChild(
                QPushButton, "pause{0}".format(elvIndex)).setText("暂停")
            self.mainView.elevatorView.logger.emit(
            f'{elvIndex} 号电梯重新启动了。')
        else:
            self.pause[elvIndex - 1] = 0
            self.mainView.findChild(
                QPushButton, "pause{0}".format(elvIndex)).setText("启动")
            self.mainView.elevatorView.logger.emit(
            f'{elvIndex} 号电梯暂停运行了。')

    def setInternalDest(self, elvIndex: int, flr: int):
        if self.pause[elvIndex - 1] == 0:
            self.mainView.elevatorView.logger.emit(
                    f" {elvIndex} 号电梯运行暂停中，无法设置目标。")
            return
        if (self.state[elvIndex - 1] == UP and flr <= self.floor[elvIndex - 1]) or (self.state[elvIndex - 1] == DOWN and flr >= self.floor[elvIndex - 1]) or flr == self.floor[elvIndex - 1]:
            return        # 上行时在电梯内按下更低的楼层 或 下行时在电梯内按下更高的楼层 均无效
        self.mainView.findChild(QPushButton, "{0}+{1}".format(elvIndex, flr)).setStyleSheet(
            "QPushButton{background-image: url(resources/checked.png)}")
        self.elevatorGoal[elvIndex -
                           1].add(Dest(flr, UP if flr > self.floor[elvIndex - 1] else DOWN))
        self.mainView.elevatorView.logger.emit(
            f' {elvIndex} 号电梯内添加了到第 {flr} 层的请求。')

    def setExternalDestUp(self, flr):
        hasElv = False
        elvIdx = -1
        for i in range(self.numElevator):
            if self.state[i] == STOP and self.floor[i] == flr and self.pause[i] != 0:
                hasElv = True
                elvIdx = i
                break
        if hasElv:
            self.shouldSleep[elvIdx] = 1
            return
        self.mainView.findChild(QPushButton, "up{0}".format(flr)).setStyleSheet(
            "QPushButton{background-image: url(resources/checked.png)}")
        min_dist = 4096
        min_dist_idx = 0
        for i in range(self.numElevator):
            if self.pause[i] == 0:
                continue
            dist = 0
            if self.state[i] == STOP or (self.state[i] != STOP and len(self.elevatorGoal[i]) == 0):
                dist = abs(self.floor[i] - flr)
            elif self.state[i] == UP:
                ub = max(self.elevatorGoal[i]).flr
                dist = 2 * ub - flr - \
                    self.floor[i] if self.floor[i] > flr else abs(
                        flr - self.floor[i])
            elif self.state[i] == DOWN:
                lb = min(self.elevatorGoal[i]).flr
                dist = self.floor[i] - \
                    flr if lb > flr else self.floor[i] + flr - 2 * lb
            if dist < min_dist:
                min_dist = dist
                min_dist_idx = i
        self.elevatorGoal[min_dist_idx].add(Dest(flr, UP))
        self.mainView.elevatorView.logger.emit(
            f'第 {flr} 层有向上的请求，为其分配了 {min_dist_idx + 1} 号电梯。')

    def setExternalDestDown(self, flr):
        hasElv = False
        elvIdx = -1
        for i in range(self.numElevator):
            if self.state[i] == STOP and self.floor[i] == flr and self.pause[i] != 0:
                hasElv = True
                elvIdx = i
                break
        if hasElv:
            self.shouldSleep[elvIdx] = 1
            return
        self.mainView.findChild(QPushButton, "down{0}".format(flr)).setStyleSheet(
            "QPushButton{background-image: url(resources/checked.png)}")
        min_dist = 4096
        min_dist_idx = 0
        for i in range(self.numElevator):
            if self.pause[i] == 0:
                continue
            dist = 0
            if self.state[i] == STOP or (self.state[i] != STOP and len(self.elevatorGoal[i]) == 0):
                dist = abs(self.floor[i] - flr)
            elif self.state[i] == UP:
                ub = max(self.elevatorGoal[i]).flr
                dist = 2 * ub - flr - \
                    self.floor[i] if ub > flr else abs(flr - self.floor[i])
            elif self.state[i] == DOWN:
                lb = min(self.elevatorGoal[i]).flr
                dist = self.floor[i] - \
                    flr if self.floor[i] > flr else self.floor[i] + \
                    flr - 2 * lb
            if dist < min_dist:
                min_dist = dist
                min_dist_idx = i
        self.elevatorGoal[min_dist_idx].add(Dest(flr, DOWN))
        self.mainView.elevatorView.logger.emit(
            f'第 {flr} 层有向下的请求，为其分配了 {min_dist_idx + 1} 号电梯。')