
STOP = 0
UP = 1
DOWN = -1


class Dest:
    flr: int
    dir: int

    def __init__(self, flr: int, dir: int) -> None:
        self.flr = flr
        self.dir = dir

    def __eq__(self, other) -> bool:
        return self.flr == other.flr and self.dir == other.dir

    def __gt__(self, other) -> bool:
        return self.flr > other.flr

    def __lt__(self, other) -> bool:
        return self.flr < other.flr

    def __hash__(self) -> int:
        return hash(self.flr + self.dir)

    def __str__(self) -> str:
        return str(self.flr)
